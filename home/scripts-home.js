var isBot = true; // Assume it is a bot until proven otherwise

var botPattern = "(Googlebot|Googlebot-Image|Googlebot-Video|Googlebot-News|Google-InspectionTool|Storebot-Google|GoogleOther|GoogleOther-Image|GoogleOther-Video|Google-CloudVertexBot|Google-Extended|AdsBot-Google-Mobile|AdsBot-Google|Mediapartners-Google|Google-Safety|Google-CWS|FeedFetcher-Google|Google-NotebookLM|Google-Pinpoint|GoogleProducer|Google-Site-Verification|APIs-Google|Bingbot|AdIdxBot|BingPreview|MicrosoftPreview|BingVideoPreview|DuckDuckBot|Bravestpplebot|Applebot-Extended|AspiegelBot|Baiduspider|DuckDuckBot|Mojeek|MojeekBot|PetalBot|SeznamHomepageCrawler|Slurp|Teoma|Yahoo-Blogs|Yahoo-FeedSeeker|Yahoo-MMCrawler|YahooSeeker|Yandex|YandexBot|YandexAdditional|YandexAdditionalBot|baidu)";
var re = new RegExp(botPattern, 'i');
var userAgent = navigator.userAgent; 
if (!re.test(userAgent)) {
    document.getElementById('dynamic-title').textContent = 'Alex.';
    isBot = false;
}

// Changes favicon based on system theme
// May not work in Safari due to aggressive caching
function themedFavicon(isDark) {
var favicons = document.querySelectorAll('.dynamic-favicon');
favicons.forEach(favicon => {
    if (isDark || isBot) {
        favicon.href = favicon.href.replace(/\/light\//, '/dark/');
    } else {
        favicon.href = favicon.href.replace(/\/dark\//, '/light/');
    }
});
}

// Set themed favicon on page load (after bot check completes)
const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
if (isLightMode) {
    themedFavicon(false); // Use light mode
} else {
    themedFavicon(true); // Use dark mode
}

// Set themed favicon on theme change
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    themedFavicon(!e.matches);
});


// Random intro/about section
const aboutMsg = [
    "I'm Alex, but you probably already guessed that - what with it saying my name just above and all.",
    "Yeah, I have a website. Nothing unusual about that. The real question is, why don't you?",
    "Who are you? What are you doing here? Oh right, looking at the website. That's fine... I guess.",
    "How did you know my name? What do you mean it says it right above this? Ah... nevermind.",
    "I don't really know what <i>should</i> go here, but it's my website, and apparently I settled on this.",
    "Welcome. Please read this informative text, it is vital. Yes, this was the best thing I could think of.",
    "This website contains lots of exciting information. For example, err.. well... at least you're here.",
    "I hope you like my website. What? You don't? Well I bet you don't have one, do you? That's what I thought.",
    "Congratulations, you're reading this text. Based on that, I estimate that you are above the age of three.",
];

if (!isBot) {
    const randomAboutMsg = aboutMsg[Math.floor(Math.random() * aboutMsg.length)];
    document.getElementById('random-about-msg').innerHTML = randomAboutMsg;
} else { // Set a more descriptive message for bots, to potentially aid in SEO
    document.getElementById('random-about-msg').innerHTML = "I have a website (that's this), I like video games, and I live in Essex - I think that's about it.";
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


// My Entertainment Section

// Store today's date - this will be used later on in the stats section too
const today = new Date();


// Calculate how long reading book
const bookStartDate = new Date('2026-01-28');
let bookReadingDays = (today - bookStartDate) / (1000 * 60 * 60 * 24);
const roundedReadingDays = Math.round(bookReadingDays);
document.getElementById('days-reading').textContent = roundedReadingDays;


// Get number of hours played per now playing game

async function updatePlayTime() {
  try {
    const playingResponse = await fetch('/api/steam-stats');
    const playingData = await playingResponse.json();
    
    // Map appids to their corresponding HTML element IDs
    const gamesToTrack = [
      { appid: 3059520, elementId: 'playingGameOne' },   // F1® 25
      { appid: 1808500, elementId: 'playingGameTwo' },    // Arc Raiders
      { appid: 268910, elementId: 'playingGameThree' }  // Cuphead
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


// Side Quests Section

// Round the percentage to fit neatly into chunks, instead of spilling over
function roundToChunk(percentage, chunkSize) {
  return Math.min(Math.round(percentage / chunkSize) * chunkSize, 100);
}

// Determine number of chunks based on screen size
function getChunkCount() {
  return window.innerWidth <= 768 ? 10 : 20;
}

// Update the progress bars for each quest
function updateQuestProgress(segmentsId, numbersId, percentId, current, target, unit) {
  
  const segmentCount = getChunkCount();
  const chunkSize = 100 / segmentCount;

  const percentage = (current / target) * 100;
  const roundedPercentage = Math.round(percentage);
  const chunkedPercentage = roundToChunk(percentage, chunkSize);
  const filledSegments = Math.floor(chunkedPercentage / chunkSize);
            
  // Update segments
  const segmentsContainer = document.getElementById(segmentsId);
  let segmentsHTML = '';
  for (let i = 0; i < segmentCount; i++) {
    segmentsHTML += `<div class="segment ${i < filledSegments ? 'filled' : ''}"></div>`;
  }
  segmentsContainer.innerHTML = segmentsHTML;
            
  // Update text
  document.getElementById(numbersId).textContent = `${current} / ${target} ${unit}`;
  document.getElementById(percentId).textContent = roundedPercentage + '%';
}

// DUOLINGO QUEST

// Calculate Duolingo streak
const duolingoStreakStart = new Date('2025-07-03');
let duolingoStreakDays = (today - duolingoStreakStart) / (1000 * 60 * 60 * 24);
duolingoStreakDays  = duolingoStreakDays - 11; // Adjust for missed days
const roundedStreakDays = Math.round(duolingoStreakDays);

// document.getElementById('duolingo-streak').textContent = roundedStreakDays;  // Also set the Duolingo stat while we're here

function updateAllQuests() {
  updateQuestProgress('duolingo-segments', 'duolingo-numbers', 'duolingo-percent', roundedStreakDays, 365, 'days');
  updateQuestProgress('books-segments', 'books-numbers', 'books-percent', 1, 5, 'books');      // <---------- UPDATE NUMBER OF BOOKS READ HERE
  updateQuestProgress('houses-segments', 'houses-numbers', 'houses-percent', 0, 1, 'houses');
}

updateAllQuests();  // Update on page load
window.addEventListener('resize', updateAllQuests);   // Update if screen is resized


// Stats Section

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


// Quote

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


// Misc

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