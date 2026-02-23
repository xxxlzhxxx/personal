// ==========================================
// Kevin Li — Personal Site
// Language toggle + smooth navigation
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initLanguageToggle();
    initNavHighlight();
});

// --- Bilingual Toggle ---
function initLanguageToggle() {
    const btn = document.getElementById('lang-toggle');
    const label = document.getElementById('lang-label');
    let isZh = true; // default Chinese

    btn.addEventListener('click', () => {
        isZh = !isZh;
        label.textContent = isZh ? 'EN' : '中';

        document.querySelectorAll('[data-zh]').forEach(el => {
            el.hidden = !isZh;
        });
        document.querySelectorAll('[data-en]').forEach(el => {
            el.hidden = isZh;
        });

        // Update html lang
        document.documentElement.lang = isZh ? 'zh-CN' : 'en';
    });
}

// --- Navigation active highlight on scroll ---
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActive() {
        const scrollPos = window.scrollY + 100;

        let currentId = '';
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
