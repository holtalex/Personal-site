// This function fetches the total number of lines of code in this Github repo, so it can be displayed in the stats section

// Cache to store results (persists until redeployment)
let cachedData = null;

export async function onRequest(context) {
  const githubToken = context.env.githubApi;
  const username = 'holtalex';
  const repoName = 'Personal-site';
  
  // Return cached data if available
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  }
  
  if (!githubToken) {
    return new Response(JSON.stringify({ 
      error: 'GitHub token not found'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Get the repository tree (all files)
    const treeResponse = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/git/trees/main?recursive=1`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Personal-Site-Stats'
        }
      }
    );
    
    if (!treeResponse.ok) {
      const errorText = await treeResponse.text();
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch repository tree',
        details: errorText
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const treeData = await treeResponse.json();
    
    // Filter for HTML, CSS, and JS files
    const webFiles = treeData.tree.filter(item => {
      if (item.type !== 'blob') return false;
      const path = item.path.toLowerCase();
      return path.endsWith('.html') || 
             path.endsWith('.css') || 
             path.endsWith('.js');
    });
    
    let totalLines = 0;
    
    // Fetch all files in parallel (much faster!)
    const filePromises = webFiles.map(file =>
      fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${file.path}`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Personal-Site-Stats'
          }
        }
      ).then(response => {
        if (response.ok) {
          return response.json();
        }
        return null;
      })
    );
    
    const fileResults = await Promise.all(filePromises);
    
    // Count lines from all files
    for (const fileData of fileResults) {
      if (fileData && fileData.content) {
        const content = atob(fileData.content);
        const lines = content.split('\n').length;
        totalLines += lines;
      }
    }
    
    const result = { 
      lines: totalLines,
      fileCount: webFiles.length
    };
    
    // Cache the result (persists until next deployment)
    cachedData = result;
    
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Caught exception',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}