var isBot = true; // Assume it is a bot until proven otherwise

var botPattern = "(Googlebot|Storebot-Google|GoogleOther|Google-Extended|AdsBot-Google-Mobile|AdsBot-Google|Mediapartners-Google|Google-Safety|Google-CWS|FeedFetcher-Google|Google-NotebookLM|Google-Pinpoint|GoogleProducer|Google-Site-Verification|APIs-Google|Bingbot|AdIdxBot|BingPreview|MicrosoftPreview|BingVideoPreview|DuckDuckBot|Bravestpplebot|Applebot-Extended|AspiegelBot|Baiduspider|DuckDuckBot|Mojeek|MojeekBot|PetalBot|SeznamHomepageCrawler|Slurp|Teoma|Yahoo-Blogs|Yahoo-FeedSeeker|Yahoo-MMCrawler|YahooSeeker|Yandex|YandexBot|YandexAdditional|YandexAdditionalBot|baidu)";
var re = new RegExp(botPattern, 'i');
var userAgent = navigator.userAgent; 
if (!re.test(userAgent)) {
    isBot = false;
} 

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