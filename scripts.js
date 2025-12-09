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


const today = new Date(); // Stores today's date

// Calculate years gaming since Steam account creation
const steamAccountDate = new Date('2020-04-26');
const yearsDiff = (today - steamAccountDate) / (1000 * 60 * 60 * 24 * 365.25);
const yearsGaming = Math.floor(yearsDiff);
document.getElementById('years-gaming').textContent = yearsGaming;

// Calculate Duolingo streak
const duolingoStreakStart = new Date('2025-07-03');
let duolingoStreakDays = (today - duolingoStreakStart) / (1000 * 60 * 60 * 24);
duolingoStreakDays  = duolingoStreakDays - 11; // Adjust for missed days
const roundedStreakDays = Math.round(duolingoStreakDays);
document.getElementById('duolingo-streak').textContent = roundedStreakDays;


// Random quote rotation
const quotes = [
    "The cake is a lie.",
    "Not Askin' You To Never Give Up. Sometimes You Gotta Let Go... Just Don't Let Anyone Change Who You Are, 'Kay?",
    "Sometimes the machines meant to serve us reveal more about humanity than we'd like to admit.",
    "When the sun goes down, you can just get… lost.",
    "It's so much easier to see the world in black and white. Gray? I don't know what to do with gray..."
];

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById('random-quote').textContent = randomQuote;


// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Remove scroll hint after first scroll
let scrollHint = document.querySelector('.scroll-hint');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100 && scrollHint) {
        scrollHint.style.opacity = '0';
    }
}, { once: true });
