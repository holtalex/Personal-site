// This function gets total hours played and number of games from Steam API to be displayed in the stats section

// Cache to store results (expires after 24 hours)
let cachedData = null;
let cacheTime = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function onRequest(context) {
  const steamApiKey = context.env.steamApi;
  const steamId = context.env.steamId; // Loaded from environment variable
  
  // Return cached data if still fresh
  if (cachedData && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
    return new Response(JSON.stringify(cachedData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
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
    
    // Map games to include name and playtime, sorted by playtime (most played first)
    const gamesWithPlaytime = data.response.games
      .map(game => ({
        appid: game.appid,
        name: game.name,
        playtimeMinutes: game.playtime_forever || 0,
        playtimeHours: Math.round((game.playtime_forever || 0) / 60 * 10) / 10, // Round to 1 decimal
      }))
      .sort((a, b) => b.playtimeMinutes - a.playtimeMinutes);
    
    const result = {
      hours: totalHours,
      gameCount: gameCount,
      games: gamesWithPlaytime
    };
    
    // Cache the result with timestamp
    cachedData = result;
    cacheTime = Date.now();
    
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