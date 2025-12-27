var isBot = false;

// Check the user agent against ones used by crawlers/bots
(async () => {
    try {
        const response = await fetch('../crawler-user-agents.json');
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
            if (!isBot) {
                themedFavicon(!e.matches);
            } else return;
        });

    } catch (error) {
        console.error('Failed to load bot patterns:', error);
        // If we can't load the patterns, assume it's a bot (safer default)
    }
})();