// =====================
// Theme Toggle
// =====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// =====================
// Mobile Navigation
// =====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// =====================
// Smooth Scrolling & Active Nav
// =====================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// =====================
// Navbar Scroll Effect
// =====================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =====================
// Scroll Animations
// =====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.work-card, .video-card, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// =====================
// Dynamic Video Management
// =====================
// This section allows you to add more videos programmatically
// Example usage:

function addVideo(slotId, videoId, title, description) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    
    const iframe = slot.querySelector('iframe');
    const titleEl = slot.querySelector('.video-title');
    const descEl = slot.querySelector('.video-desc');
    
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    titleEl.textContent = title;
    descEl.textContent = description;
    slot.style.display = 'block';
}

// Example: Uncomment and modify to add videos
// addVideo('videoSlot1', 'YOUR_VIDEO_ID', 'Project Title', 'Project Description');
// addVideo('videoSlot2', 'YOUR_VIDEO_ID', 'Another Project', 'Another Description');

// =====================
// Work Card Image Loading
// =====================
// You can add actual movie posters by modifying the work cards
// Example function to add background images:

function setWorkImage(cardIndex, imageUrl) {
    const cards = document.querySelectorAll('.work-card');
    if (cards[cardIndex]) {
        const workImage = cards[cardIndex].querySelector('.work-image');
        workImage.style.backgroundImage = `url('${imageUrl}')`;
        workImage.style.backgroundSize = 'cover';
        workImage.style.backgroundPosition = 'center';
    }
}

// Example: Uncomment to add images
// setWorkImage(0, 'path/to/kaadhal-poster.jpg');
// setWorkImage(1, 'path/to/oru-nalla-poster.jpg');

// =====================
// Lazy Loading for Videos
// =====================
const videoCards = document.querySelectorAll('.video-card');

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const iframe = entry.target.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
                iframe.src = iframe.dataset.src;
                videoObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

videoCards.forEach(card => {
    videoObserver.observe(card);
});

// =====================
// Preloader (Optional)
// =====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});
