export async function onRequest(context) {
  const githubToken = context.env.githubApi;
  const username = 'holtalex'; // ← Change this!
  
  try {
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Personal-Site-Stats'
        }
      }
    );
    
    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repos');
    }
    
    const repos = await reposResponse.json();
    let totalBytes = 0;
    const webLanguages = ['HTML', 'CSS', 'JavaScript'];
    
    for (const repo of repos) {
      if (!repo.fork) {
        const langResponse = await fetch(repo.languages_url, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Personal-Site-Stats'
          }
        });
        
        if (langResponse.ok) {
          const languages = await langResponse.json();
          
          for (const [lang, bytes] of Object.entries(languages)) {
            if (webLanguages.includes(lang)) {
              totalBytes += bytes;
            }
          }
        }
      }
    }
    
    const estimatedLines = Math.round(totalBytes / 50);
    
    return new Response(JSON.stringify({ lines: estimatedLines }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}