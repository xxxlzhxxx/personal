// ==========================================
// Kevin Li — Personal Site
// Dynamic content loading from JSON files
// ==========================================

let currentLang = 'zh';
const contentCache = {};

// --- Section definitions: maps section id → content path + renderer ---
const sections = [
    { id: 'about', path: 'content/about/content.json', render: renderAbout },
    { id: 'skills', path: 'content/skills/content.json', render: renderSkills },
    { id: 'experience', path: 'content/experience/content.json', render: renderExperience },
    { id: 'thoughts', path: 'content/thoughts/content.json', render: renderThoughts },
    { id: 'contact', path: 'content/contact/content.json', render: renderContact },
];

const navItems = [
    { id: 'about', zh: '关于', en: 'About' },
    { id: 'skills', zh: '我能帮你', en: 'How I Help' },
    { id: 'experience', zh: '经历', en: 'Experience' },
    { id: 'thoughts', zh: '思考', en: 'Thoughts' },
    { id: 'contact', zh: '联系', en: 'Contact' },
];

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
    renderNav();
    await loadHeader();
    await Promise.all(sections.map(s => loadSection(s)));
    initLanguageToggle();
    initNavHighlight();
    initSmoothScroll();
});

// --- Load JSON helper ---
async function loadJSON(path) {
    if (contentCache[path]) return contentCache[path];
    const res = await fetch(path);
    const data = await res.json();
    contentCache[path] = data;
    return data;
}

// --- Navigation ---
function renderNav() {
    const container = document.getElementById('nav-links');
    container.innerHTML = navItems.map(item =>
        `<a href="#${item.id}" class="nav-link" data-section="${item.id}">
            <span data-zh>${item.zh}</span><span data-en hidden>${item.en}</span>
        </a>`
    ).join('');
}

// --- Header ---
async function loadHeader() {
    const data = await loadJSON('content/header/content.json');
    const links = data.links;

    document.getElementById('header-name').innerHTML =
        `<span data-zh>${data.zh.name}</span><span data-en hidden>${data.en.name}</span>`;
    document.getElementById('header-subtitle').innerHTML =
        `<span data-zh>${data.zh.subtitle}</span><span data-en hidden>${data.en.subtitle}</span>`;
    document.getElementById('header-tagline').innerHTML =
        `<span data-zh>${data.zh.tagline}</span><span data-en hidden>${data.en.tagline}</span>`;

    // Insert social links before the lang toggle button
    const headerLinks = document.getElementById('header-links');
    const toggle = document.getElementById('lang-toggle');
    const linksHTML = `
        <a href="mailto:${links.email}" title="Email">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </a>
        <a href="${links.github}" target="_blank" title="GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <a href="${links.linkedin}" target="_blank" title="LinkedIn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>`;

    const temp = document.createElement('div');
    temp.innerHTML = linksHTML;
    while (temp.firstChild) {
        headerLinks.insertBefore(temp.firstChild, toggle);
    }
}

// --- Load & render each section ---
async function loadSection(section) {
    const data = await loadJSON(section.path);
    const el = document.getElementById(section.id);
    el.innerHTML = section.render(data);
}

// --- Renderers ---

function renderAbout(data) {
    return `
        <h2><span data-zh>${data.zh.title}</span><span data-en hidden>${data.en.title}</span></h2>
        <div class="about-content">
            <div data-zh>
                ${data.zh.paragraphs.map(p => `<p>${p}</p>`).join('')}
                <p class="motto"><em>"${data.zh.motto}"</em></p>
            </div>
            <div data-en hidden>
                ${data.en.paragraphs.map(p => `<p>${p}</p>`).join('')}
                <p class="motto"><em>"${data.en.motto}"</em></p>
            </div>
        </div>`;
}

function renderSkills(data) {
    function cardHTML(items) {
        return items.map(item => `
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">${item.icon}</span>
                    <h3>${item.title}</h3>
                </div>
                <p>${item.description}</p>
            </div>`).join('');
    }
    return `
        <h2><span data-zh>${data.zh.title}</span><span data-en hidden>${data.en.title}</span></h2>
        <div class="card-list">
            <div data-zh>${cardHTML(data.zh.items)}</div>
            <div data-en hidden>${cardHTML(data.en.items)}</div>
        </div>`;
}

function renderExperience(data) {
    function expHTML(items) {
        return items.map(item => `
            <div class="exp-item">
                <div class="exp-meta">
                    <span class="exp-company">${item.company}</span>
                    ${item.current ? '<span class="exp-badge current">Current</span>' : ''}
                </div>
                <h3>${item.role}</h3>
                <p>${item.description}</p>
            </div>`).join('');
    }
    return `
        <h2><span data-zh>${data.zh.title}</span><span data-en hidden>${data.en.title}</span></h2>
        <div class="exp-list">
            <div data-zh>${expHTML(data.zh.items)}</div>
            <div data-en hidden>${expHTML(data.en.items)}</div>
        </div>`;
}

function renderThoughts(data) {
    return `
        <h2><span data-zh>${data.zh.title}</span><span data-en hidden>${data.en.title}</span></h2>
        <div data-zh>
            <p>${data.zh.intro}</p>
            <p>${data.zh.paragraphs[0]}</p>
            <blockquote>${data.zh.quote}</blockquote>
            <p>${data.zh.paragraphs[1]}</p>
        </div>
        <div data-en hidden>
            <p>${data.en.intro}</p>
            <p>${data.en.paragraphs[0]}</p>
            <blockquote>${data.en.quote}</blockquote>
            <p>${data.en.paragraphs[1]}</p>
        </div>`;
}

function renderContact(data) {
    const linksHTML = data.links.map(link =>
        `<a href="${link.url}" ${link.url.startsWith('mailto') ? '' : 'target="_blank"'}>${link.label}</a>`
    ).join('');

    return `
        <h2><span data-zh>${data.zh.title}</span><span data-en hidden>${data.en.title}</span></h2>
        <div data-zh>
            ${data.zh.paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>
        <div data-en hidden>
            ${data.en.paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>
        <div class="contact-links">${linksHTML}</div>`;
}

// --- Language Toggle ---
function initLanguageToggle() {
    const btn = document.getElementById('lang-toggle');
    const label = document.getElementById('lang-label');

    btn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        label.textContent = currentLang === 'zh' ? 'EN' : '中';

        document.querySelectorAll('[data-zh]').forEach(el => {
            el.hidden = currentLang !== 'zh';
        });
        document.querySelectorAll('[data-en]').forEach(el => {
            el.hidden = currentLang !== 'en';
        });

        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    });
}

// --- Nav highlight on scroll ---
function initNavHighlight() {
    const sectionEls = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActive() {
        const scrollPos = window.scrollY + 100;
        let currentId = '';
        sectionEls.forEach(section => {
            if (scrollPos >= section.offsetTop) currentId = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}

// --- Smooth scroll ---
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}
