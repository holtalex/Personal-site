// This function gets total hours played and number of games from Steam API to be displyayed in the stats section

// Cache to store results (persists until redeployment)
let cachedData = null;

export async function onRequest(context) {
  const steamApiKey = context.env.steamApi;
  const steamId = context.env.steamId;
  
  // Return cached data if available
  if (cachedData) {
    return new Response(JSON.stringify(cachedData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }
  
  if (!steamApiKey) {
    return new Response(JSON.stringify({ 
      error: 'Steam API key not found'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Fetch all owned games with playtime
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamId}&format=json&include_played_free_games=1&include_appinfo=1`,
      {
        headers: {
          'User-Agent': 'Personal-Site-Stats'
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch Steam data',
        status: response.status,
        details: errorText
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    
    if (!data.response || !data.response.games) {
      return new Response(JSON.stringify({ 
        error: 'No games found or invalid Steam ID',
        details: 'Check that your Steam profile is public'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Sum up total playtime (Steam returns minutes, convert to hours)
    const totalMinutes = data.response.games.reduce((sum, game) => {
      return sum + (game.playtime_forever || 0);
    }, 0);
    
    const totalHours = Math.round(totalMinutes / 60);
    const gameCount = data.response.game_count;
    
    const result = {
      hours: totalHours,
      gameCount: gameCount
    };
    
    // Cache the result
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