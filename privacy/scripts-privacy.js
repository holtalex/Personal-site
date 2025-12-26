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
    themedFavicon('../favicon-light.png');
} else {
    themedFavicon('../favicon-dark.png');
}

// Set themed favicon on theme change
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (e.matches) {
        themedFavicon('../favicon-light.png');
    } else {
        themedFavicon('../favicon-dark.png');
    }
});

