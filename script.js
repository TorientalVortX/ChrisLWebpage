// ===== DOM Elements =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

// ===== Mobile Navigation =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 64;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== Scroll Effects =====
function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Scroll progress bar
    if (docHeight > 0) {
        scrollProgress.style.width = (scrollY / docHeight * 100) + '%';
    }

    // Navbar state
    navbar.classList.toggle('scrolled', scrollY > 30);

    // Back to top button
    backToTop.classList.toggle('visible', scrollY > 500);

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 200) {
            currentId = section.id;
        }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
}

window.addEventListener('scroll', onScroll, { passive: true });

// Back to top click
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Reveal on Scroll =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Stat Counter Animation =====
function animateCounter(el, target, suffix) {
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);
        el.textContent = current + (suffix || '');
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-target]').forEach(el => {
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, suffix);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) statObserver.observe(aboutSection);

// ===== Typing Effect for Hero Name =====
(function () {
    const el = document.getElementById('heroName');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 45);
        }
    }

    // Start after a brief delay for initial paint
    setTimeout(type, 600);
})();

// ===== GitHub Projects =====
class GitHubProjects {
    constructor(username, containerId) {
        this.username = username;
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    async init() {
        this.showSkeleton();
        try {
            const repos = await this.fetchRepos();
            const filtered = this.filterRepos(repos);
            this.render(filtered.slice(0, 6));
        } catch {
            this.showError();
        }
    }

    async fetchRepos() {
        const res = await fetch(
            `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=50`
        );
        if (!res.ok) throw new Error(res.status);
        return res.json();
    }

    filterRepos(repos) {
        return repos
            .filter(r => !r.fork && !r.private)
            .sort((a, b) => {
                if (a.stargazers_count !== b.stargazers_count)
                    return b.stargazers_count - a.stargazers_count;
                return new Date(b.updated_at) - new Date(a.updated_at);
            });
    }

    langColor(lang) {
        const colors = {
            JavaScript: '#f7df1e', Python: '#3776ab', Java: '#007396',
            PHP: '#777bb4', HTML: '#e34f26', CSS: '#1572b6',
            TypeScript: '#3178c6', 'C++': '#00599c', 'C#': '#239120',
            Rust: '#dea584', Lua: '#2c2d72', Go: '#00add8',
            Shell: '#89e051', Dockerfile: '#384d54'
        };
        return colors[lang] || '#6b7280';
    }

    langIcon(lang) {
        const icons = {
            JavaScript: 'fab fa-js-square', Python: 'fab fa-python',
            Java: 'fab fa-java', PHP: 'fab fa-php',
            HTML: 'fab fa-html5', CSS: 'fab fa-css3-alt',
            TypeScript: 'fab fa-js-square', Rust: 'fas fa-cog',
            Lua: 'fas fa-moon', Shell: 'fas fa-terminal',
            Dockerfile: 'fab fa-docker'
        };
        return icons[lang] || 'fas fa-code';
    }

    relativeDate(dateStr) {
        const days = Math.ceil(Math.abs(Date.now() - new Date(dateStr)) / 864e5);
        if (days < 2) return 'Updated yesterday';
        if (days < 7) return `Updated ${days} days ago`;
        if (days < 30) return `Updated ${Math.ceil(days / 7)} weeks ago`;
        if (days < 365) return `Updated ${Math.ceil(days / 30)} months ago`;
        return `Updated ${Math.ceil(days / 365)} years ago`;
    }

    render(repos) {
        if (!repos.length) {
            this.showError();
            return;
        }

        this.container.innerHTML = repos.map(repo => {
            const lang = repo.language || 'Unknown';
            const desc = repo.description || 'No description provided';
            const topics = (repo.topics || []).slice(0, 5)
                .map(t => `<span class="project-topic">${this.escapeHtml(t)}</span>`).join('');

            return `
            <div class="project-card github-project">
                <div class="project-image">
                    <i class="${this.langIcon(lang)}"></i>
                    <div class="project-overlay">
                        <div class="project-stats">
                            <span class="stat-item"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span class="stat-item"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3>${this.escapeHtml(repo.name)}</h3>
                        <div class="project-links">
                            <a href="${this.escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="project-link" title="GitHub"><i class="fab fa-github"></i></a>
                            ${repo.homepage ? `<a href="${this.escapeHtml(repo.homepage)}" target="_blank" rel="noopener noreferrer" class="project-link" title="Live"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                    </div>
                    <p class="project-description">${this.escapeHtml(desc)}</p>
                    <div class="project-meta">
                        <div class="project-language">
                            <span class="language-dot" style="background-color:${this.langColor(lang)}"></span>
                            ${this.escapeHtml(lang)}
                        </div>
                        <div>${this.relativeDate(repo.updated_at)}</div>
                    </div>
                    ${topics ? `<div class="project-topics">${topics}</div>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    showSkeleton() {
        this.container.innerHTML = `<div class="loading-skeleton">${
            '<div class="skeleton-card"><div class="skeleton-header"></div><div class="skeleton-content"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div>'.repeat(6)
        }</div>`;
    }

    showError() {
        this.container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load projects</h3>
                <p>Please check your connection and try again.</p>
            </div>`;
    }
}

// Initialize GitHub projects
new GitHubProjects('TorientalVortX', 'projects-grid');

