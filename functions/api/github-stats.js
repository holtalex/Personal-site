export async function onRequest(context) {
  const githubToken = context.env.githubApi;
  const username = 'holtalex'; // ← Make sure this is YOUR actual username
  
  // Check if token exists
  if (!githubToken) {
    return new Response(JSON.stringify({ 
      error: 'GitHub token not found',
      details: 'Secret githubApi is not set in Cloudflare Pages environment variables'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
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
    
    // Get detailed error info
    if (!reposResponse.ok) {
      const errorBody = await reposResponse.text();
      return new Response(JSON.stringify({ 
        error: 'GitHub API request failed',
        status: reposResponse.status,
        statusText: reposResponse.statusText,
        body: errorBody,
        username: username
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
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
    return new Response(JSON.stringify({ 
      error: 'Caught exception',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}