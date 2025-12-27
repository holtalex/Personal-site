// Changes favicon based on system theme
// May not work in Safari due to aggressive caching

function themedFavicon(isDark) {
 var favicons = document.querySelectorAll('.dynamic-favicon');
 favicons.forEach(favicon => {
     if (isDark) {
         favicon.href = favicon.href.replace(/\/light\//, '/dark/');
     } else {
         favicon.href = favicon.href.replace(/\/dark\//, '/light/');
     }
 });
}

// Set themed favicon on page load
const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
if (isLightMode && !isBot) {
    themedFavicon(false);  // Use light mode
} else {
    themedFavicon(true);   // Use dark mode
}

// Set themed favicon on theme change
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    themedFavicon(!e.matches);
});
