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
        'X-Cache': 'HIT'
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
    
    // Fetch and count lines for each file
    for (const file of webFiles) {
      const fileResponse = await fetch(
        `https://api.github.com/repos/${username}/${repoName}/contents/${file.path}`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Personal-Site-Stats'
          }
        }
      );
      
      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        
        // Decode base64 content
        const content = atob(fileData.content);
        
        // Count lines (split by newlines)
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
        'X-Cache': 'MISS'
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