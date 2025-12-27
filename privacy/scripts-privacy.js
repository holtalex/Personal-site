var isBot = false;

// Check the user agent against ones used by crawlers/bots
(async () => {
    try {
        const response = await fetch('../home/crawler-user-agents.json');
        if (!response.ok) {
            throw new Error('Could not find crawler-user-agents.json');
        }
        const data = await response.json();
        const botPattern = "(" + data.patterns.join("|") + ")";
        const re = new RegExp(botPattern, 'i');
        const userAgent = navigator.userAgent;
        if (re.test(userAgent)) {
            isBot = true;
        }

    } catch (error) {
        console.error('Failed to load bot patterns:', error);
    }
})();

// Changes favicon based on system theme
// May not work in Safari due to aggressive caching
function themedFavicon(isDark) {
var favicons = document.querySelectorAll('.dynamic-favicon');
favicons.forEach(favicon => {
    let url = favicon.href.split('?')[0]; // Remove any existing query params
    if (isDark || isBot) {
        url = url.replace(/\/light\//, '/dark/');
    } else {
        url = url.replace(/\/dark\//, '/light/');
    }
    favicon.href = url + '?v=' + Date.now(); // Add timestamp to bust cache
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