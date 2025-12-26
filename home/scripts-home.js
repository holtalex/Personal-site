// Changes favicon based on system theme
// May not work in Safari due to aggressive caching
document.head = document.head || document.getElementsByTagName('head')[0];

function themedFavicon(src) {
 var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
 link.id = 'dynamic-favicon';
 link.rel = 'shortcut icon';
 link.href = src;
 if (oldLink) {
  document.head.removeChild(oldLink);
 }
 document.head.appendChild(link);
}

// Set themed favicon on page load
const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
if (isLightMode) {
    themedFavicon('favicon-light.png');
} else {
    themedFavicon('favicon-dark.png');
}

// Set themed favicon on theme change
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (e.matches) {
        themedFavicon('favicon-light.png');
    } else {
        themedFavicon('favicon-dark.png');
    }
});


// Change the title when not being indexed by Bing (Bing hates small titles, but Google just deals with it)
var botPattern = "(bingbot|adidxbot|bingpreview|microsoftpreview|bingvideopreview)";
var re = new RegExp(botPattern, 'i');
var userAgent = navigator.userAgent; 
if (!re.test(userAgent)) {
    document.title = 'Alex.';
}


// Terminal navigation
document.querySelectorAll('.terminal-line[data-scroll-to]').forEach(line => {
    line.addEventListener('click', function() {
        const targetId = this.getAttribute('data-scroll-to');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// Get number of hours played per now playing game

async function updatePlayTime() {
  try {
    const playingResponse = await fetch('/api/steam-stats');
    const playingData = await playingResponse.json();
    
    // Map appids to their corresponding HTML element IDs
    const gamesToTrack = [
      { appid: 1876590, elementId: 'playingGameOne' },   // I Am Your Beast
      { appid: 268910, elementId: 'playingGameTwo' },    // Cuphead
      { appid: 3059520, elementId: 'playingGameThree' }  // F1® 25
    ];
    
    gamesToTrack.forEach(({ appid, elementId }) => {
      const game = playingData.games.find(g => g.appid === appid);
      document.getElementById(elementId).textContent = 
        game?.playtimeHours.toLocaleString() ?? '0';
    });
    
  } catch (error) {
    console.error('Failed to load Steam stats:', error);
    // Set all to error state
    ['playingGameOne', 'playingGameTwo', 'playingGameThree'].forEach(id => {
      document.getElementById(id).textContent = '--';
    });
  }
}

updatePlayTime(); // Call when page loads


// Year navigation for resolutions
let currentYear = 2025;
const years = [2025, 2026];

function updateResolutionYear() {
    // Update year display
    document.getElementById('current-year').textContent = currentYear;
    
    // Show/hide resolution lists
    years.forEach(year => {
        const list = document.getElementById(`resolutions-${year}`);
        if (list) {
            list.style.display = year === currentYear ? 'flex' : 'none';
        }
    });
    
    // Enable/disable navigation arrows
    const prevBtn = document.getElementById('prev-year');
    const nextBtn = document.getElementById('next-year');
    
    if (currentYear <= Math.min(...years)) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }
    
    if (currentYear >= Math.max(...years)) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
    }
}

document.getElementById('prev-year').addEventListener('click', () => {
    if (currentYear > Math.min(...years)) {
        currentYear--;
        updateResolutionYear();
    }
});

document.getElementById('next-year').addEventListener('click', () => {
    if (currentYear < Math.max(...years)) {
        currentYear++;
        updateResolutionYear();
    }
});

// Initialize
updateResolutionYear();


const today = new Date(); // Stores today's date

// Calculate Duolingo streak
const duolingoStreakStart = new Date('2025-07-03');
let duolingoStreakDays = (today - duolingoStreakStart) / (1000 * 60 * 60 * 24);
duolingoStreakDays  = duolingoStreakDays - 11; // Adjust for missed days
const roundedStreakDays = Math.round(duolingoStreakDays);
document.getElementById('duolingo-streak').textContent = roundedStreakDays;

// Get number of hours gaming on Steam

async function updateSteamStats() {
  try {
    const steamResponse = await fetch('/api/steam-stats');
    const steamData = await steamResponse.json();
    
    document.getElementById('hours-gaming').textContent = 
      steamData.hours.toLocaleString();
  } catch (error) {
    console.error('Failed to load Steam stats:', error);
    document.getElementById('hours-gaming').textContent = '--';
  }
}


// Get number of lines in this repo

async function updateGitHubStats() {
  try {
    const githubResponse = await fetch('/api/github-stats');
    const githubData = await githubResponse.json();
    
    document.getElementById('lines-code').textContent = 
      githubData.lines.toLocaleString();
  } catch (error) {
    console.error('Failed to load GitHub stats:', error);
    document.getElementById('lines-code').textContent = '--';
  }
}

updateSteamStats(); // Call when page loads
updateGitHubStats();


// Random video game quote rotation
const quotes = [
    "The cake is a lie.",
    "Not Askin' You To Never Give Up. Sometimes You Gotta Let Go... Just Don't Let Anyone Change Who You Are, 'Kay?",
    "Sometimes the machines meant to serve us reveal more about humanity than we'd like to admit.",
    "When the sun goes down, you can just get… lost.",
    "It's so much easier to see the world in black and white. Gray? I don't know what to do with gray...",
    "You, Sir, Are A Fish.",
    "You Forget A Thousand Things Every Day, Pal. Make Sure This Is One Of 'Em.",
    "Just because I happen to be here when you call doesn't mean I'm waiting for you."
];

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById('random-quote').textContent = randomQuote;

// Remove scroll hint after first scroll
let scrollHint = document.querySelector('.scroll-hint');
window.addEventListener('scroll', function handler() {
    if (window.scrollY > 100 && scrollHint) {
        scrollHint.style.animation = 'none';
        void scrollHint.offsetHeight;
        scrollHint.style.transition = 'opacity 0.5s ease';
        scrollHint.style.opacity = '0';
        window.removeEventListener('scroll', handler);
    }
});