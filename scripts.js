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

// Calculate years gaming since Steam account creation
const steamAccountDate = new Date('2020-04-26');
const today = new Date();
const yearsDiff = (today - steamAccountDate) / (1000 * 60 * 60 * 24 * 365.25);
const yearsGaming = Math.floor(yearsDiff);
document.getElementById('years-gaming').textContent = yearsGaming;

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
