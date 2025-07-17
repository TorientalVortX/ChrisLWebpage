// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 20, 25, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 20, 25, 0.95)';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Skill tags hover effect
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
        this.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Project cards hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
        this.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
        this.style.borderColor = 'rgba(59, 130, 246, 0.2)';
    });
});

// Certification cards hover effect
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 15px 30px rgba(59, 130, 246, 0.2)';
        this.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
        this.style.borderColor = 'rgba(59, 130, 246, 0.2)';
    });
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    timelineObserver.observe(item);
});

// Typing effect for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title .text-gradient');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Statistics counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Dynamic Stats Calculator
class StatsCalculator {
    constructor() {
        this.stats = {
            projects: 0,
            experience: 0,
            certifications: 0
        };
    }

    // Calculate projects from GitHub API and static projects
    async calculateProjects() {
        try {
            // Get GitHub repos count
            const response = await fetch('https://api.github.com/users/TorientalVortX/repos?per_page=100');
            if (response.ok) {
                const repos = await response.json();
                const publicRepos = repos.filter(repo => !repo.fork && !repo.private);
                this.stats.projects = publicRepos.length;
            } else {
                // Fallback to manual count if API fails
                this.stats.projects = 20; // Your estimated count
            }
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            this.stats.projects = 20; // Fallback
        }
    }

    // Calculate years of experience
    calculateExperience() {
        const startDate = new Date('2023-12-01'); // Your start date at Skeleton Key
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - startDate);
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
        
        // Include your 2018 summer technician role
        const additionalExperience = 0.25; // 3 months in 2018
        
        this.stats.experience = Math.max(1, Math.round(diffYears + additionalExperience));
    }

    // Calculate certifications from the certifications section
    calculateCertifications() {
        const certCards = document.querySelectorAll('.cert-card');
        this.stats.certifications = certCards.length;
    }

    // Update the stat items in the DOM
    updateStatsDisplay() {
        const statItems = document.querySelectorAll('.about-stats .stat-item h3');
        
        if (statItems.length >= 3) {
            statItems[0].textContent = `${this.stats.projects}+`; // Projects
            statItems[1].textContent = `${this.stats.experience}`; // Years Experience
            statItems[2].textContent = `${this.stats.certifications}`; // Certifications
        }
    }

    // Initialize and calculate all stats
    async init() {
        this.calculateCertifications();
        this.calculateExperience();
        await this.calculateProjects();
        this.updateStatsDisplay();
    }
}

// Initialize stats calculator
const statsCalculator = new StatsCalculator();

// Modify the existing counter animation to use dynamic values
const aboutSection = document.querySelector('.about');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = document.querySelectorAll('.stat-item h3');
            counters.forEach((counter, index) => {
                let target;
                switch(index) {
                    case 0: // Projects
                        target = statsCalculator.stats.projects;
                        break;
                    case 1: // Experience
                        target = statsCalculator.stats.experience;
                        break;
                    case 2: // Certifications
                        target = statsCalculator.stats.certifications;
                        break;
                    default:
                        target = parseInt(counter.textContent);
                }
                
                // Animate to the calculated value
                animateCounter(counter, target, 2000);
                
                // Add the "+" for projects after animation
                if (index === 0) {
                    setTimeout(() => {
                        counter.textContent = target + '+';
                    }, 2100);
                }
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');
    
    // Initialize stats calculator
    statsCalculator.init();
    
    // Add any additional initialization here
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});


// GitHub API Integration for Dynamic Projects
class GitHubProjectsManager {
    constructor(username) {
        this.username = username;
        this.apiUrl = `https://api.github.com/users/${username}/repos`;
        this.projectsContainer = document.querySelector('.projects-grid');
        this.loadingElement = null;
    }

    // Create loading skeleton
    createLoadingSkeleton() {
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-card">
                <div class="skeleton-header"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        `.repeat(6);
        return skeleton;
    }

    // Show loading state
    showLoading() {
        this.loadingElement = this.createLoadingSkeleton();
        this.projectsContainer.innerHTML = '';
        this.projectsContainer.appendChild(this.loadingElement);
    }

    // Hide loading state
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.remove();
            this.loadingElement = null;
        }
    }

    // Fetch repositories from GitHub API
    async fetchRepositories() {
        try {
            const response = await fetch(`${this.apiUrl}?sort=updated&per_page=50`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const repos = await response.json();
            return repos.filter(repo => !repo.fork && !repo.private); // Filter out forks and private repos
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            return [];
        }
    }

    // Get appropriate icon for repository language
    getLanguageIcon(language) {
        const icons = {
            'JavaScript': 'fab fa-js-square',
            'Python': 'fab fa-python',
            'Java': 'fab fa-java',
            'PHP': 'fab fa-php',
            'HTML': 'fab fa-html5',
            'CSS': 'fab fa-css3-alt',
            'TypeScript': 'fab fa-js-square',
            'C++': 'fas fa-code',
            'C#': 'fas fa-code',
            'Rust': 'fas fa-cog',
            'Lua': 'fas fa-moon',
            'Go': 'fas fa-code',
            'Swift': 'fab fa-swift',
            'Kotlin': 'fas fa-code',
            'Ruby': 'fas fa-gem',
            'Shell': 'fas fa-terminal',
            'Dockerfile': 'fab fa-docker',
            'Vue': 'fab fa-vuejs',
            'React': 'fab fa-react'
        };
        return icons[language] || 'fas fa-code';
    }

    // Get color for different languages
    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f7df1e',
            'Python': '#3776ab',
            'Java': '#007396',
            'PHP': '#777bb4',
            'HTML': '#e34f26',
            'CSS': '#1572b6',
            'TypeScript': '#3178c6',
            'C++': '#00599c',
            'C#': '#239120',
            'Rust': '#000000',
            'Lua': '#2c2d72',
            'Go': '#00add8',
            'Swift': '#fa7343',
            'Kotlin': '#0095d5',
            'Ruby': '#cc342d',
            'Shell': '#89e051',
            'Dockerfile': '#384d54',
            'Vue': '#4fc08d',
            'React': '#61dafb'
        };
        return colors[language] || '#6b7280';
    }

    // Format date to relative time
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Updated yesterday';
        if (diffDays < 7) return `Updated ${diffDays} days ago`;
        if (diffDays < 30) return `Updated ${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `Updated ${Math.ceil(diffDays / 30)} months ago`;
        return `Updated ${Math.ceil(diffDays / 365)} years ago`;
    }

    // Create project card HTML
    createProjectCard(repo) {
        const description = repo.description || 'No description provided';
        const language = repo.language || 'Unknown';
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        const lastUpdate = this.formatDate(repo.updated_at);
        
        // Extract topics (GitHub repo tags)
        const topics = repo.topics || [];
        const topicsHtml = topics.slice(0, 5).map(topic => 
            `<span class="project-topic">${topic}</span>`
        ).join('');

        return `
            <div class="project-card github-project" data-repo="${repo.name}">
                <div class="project-image">
                    <i class="${this.getLanguageIcon(language)}"></i>
                    <div class="project-overlay">
                        <div class="project-stats">
                            <span class="stat-item">
                                <i class="fas fa-star"></i>
                                ${stars}
                            </span>
                            <span class="stat-item">
                                <i class="fas fa-code-branch"></i>
                                ${forks}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3>${repo.name}</h3>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" class="project-link" title="View on GitHub">
                                <i class="fab fa-github"></i>
                            </a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link" title="View Live Demo">
                                <i class="fas fa-external-link-alt"></i>
                            </a>` : ''}
                        </div>
                    </div>
                    <p class="project-description">${description}</p>
                    <div class="project-meta">
                        <div class="project-language">
                            <span class="language-dot" style="background-color: ${this.getLanguageColor(language)}"></span>
                            ${language}
                        </div>
                        <div class="project-updated">${lastUpdate}</div>
                    </div>
                    <div class="project-topics">
                        ${topicsHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        this.projectsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load projects</h3>
                <p>${message}</p>
                <button onclick="githubProjects.loadProjects()" class="btn btn-primary">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
    }

    // Filter and sort repositories
    filterAndSortRepos(repos) {
        // Filter out repos with no meaningful content
        const filtered = repos.filter(repo => {
            // Skip if it's a fork, private, or has no description and no stars
            if (repo.fork || repo.private) return false;
            if (!repo.description && repo.stargazers_count === 0) return false;
            return true;
        });

        // Sort by: pinned first, then by stars, then by update date
        return filtered.sort((a, b) => {
            // Prioritize repos with more stars
            if (a.stargazers_count !== b.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            // Then by update date
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
    }

    // Load and display projects
    async loadProjects() {
        this.showLoading();
        
        try {
            const repos = await this.fetchRepositories();
            
            if (repos.length === 0) {
                this.showError('No repositories found or unable to fetch data.');
                return;
            }

            const filteredRepos = this.filterAndSortRepos(repos);
            
            // Take top 6 repositories
            const topRepos = filteredRepos.slice(0, 6);
            
            this.hideLoading();
            
            // Create project cards
            const projectsHtml = topRepos.map(repo => this.createProjectCard(repo)).join('');
            this.projectsContainer.innerHTML = projectsHtml;
            
            // Add hover animations
            this.addHoverEffects();
            
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to load projects. Please check your internet connection and try again.');
            console.error('Error loading projects:', error);
        }
    }

    // Add hover effects to project cards
    addHoverEffects() {
        const projectCards = document.querySelectorAll('.github-project');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // Initialize the manager
    init() {
        this.loadProjects();
    }
}

// Add CSS styles for GitHub projects
const githubStyles = document.createElement('style');
githubStyles.textContent = `
    .loading-skeleton {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }

    .skeleton-card {
        background: rgba(15, 20, 25, 0.8);
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid rgba(59, 130, 246, 0.2);
        animation: pulse 1.5s ease-in-out infinite alternate;
    }

    .skeleton-header {
        height: 60px;
        background: linear-gradient(135deg, #3b82f6, #ef4444);
        border-radius: 8px;
        margin-bottom: 1rem;
        opacity: 0.3;
    }

    .skeleton-line {
        height: 16px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 4px;
        margin: 0.5rem 0;
    }

    .skeleton-line.short {
        width: 60%;
    }

    @keyframes pulse {
        0% { opacity: 0.6; }
        100% { opacity: 0.8; }
    }

    .github-project {
        transition: all 0.3s ease;
    }

    .project-image {
        position: relative;
        overflow: hidden;
    }

    .project-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .project-card:hover .project-overlay {
        opacity: 1;
    }

    .project-stats {
        display: flex;
        gap: 1rem;
        color: white;
        font-size: 0.9rem;
    }

    .stat-item {
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .project-links {
        display: flex;
        gap: 0.5rem;
    }

    .project-link {
        color: #3b82f6;
        font-size: 1.2rem;
        transition: color 0.3s ease;
    }

    .project-link:hover {
        color: #ef4444;
    }

    .project-description {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 1rem;
        font-size: 0.95rem;
    }

    .project-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.85rem;
        color: #94a3b8;
    }

    .project-language {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .language-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .project-topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .project-topic {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        background: rgba(239, 68, 68, 0.1);
        border-radius: 12px;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .error-message i {
        font-size: 3rem;
        color: #ef4444;
        margin-bottom: 1rem;
    }

    .error-message h3 {
        color: #ef4444;
        margin-bottom: 1rem;
    }

    .error-message p {
        color: #cbd5e1;
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        .project-header {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .project-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
`;

document.head.appendChild(githubStyles);

// Initialize GitHub Projects Manager
// Replace 'your-github-username' with your actual GitHub username
const githubProjects = new GitHubProjectsManager('TorientalVortX');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        githubProjects.init();
    }, 500);
});

// Add refresh functionality
function refreshProjects() {
    githubProjects.loadProjects();
}

// Optional: Add a refresh button to the projects section
function addRefreshButton() {
    const projectsSection = document.querySelector('#projects .container');
    const refreshBtn = document.createElement('div');
    refreshBtn.className = 'refresh-container';
    refreshBtn.innerHTML = `
        <button onclick="refreshProjects()" class="btn btn-secondary refresh-btn">
            <i class="fas fa-sync-alt"></i>
            Refresh Projects
        </button>
    `;
    
    const sectionTitle = projectsSection.querySelector('.section-title');
    sectionTitle.insertAdjacentElement('afterend', refreshBtn);
}

// Add refresh button styles
const refreshStyles = document.createElement('style');
refreshStyles.textContent = `
    .refresh-container {
        text-align: center;
        margin-bottom: 2rem;
    }

    .refresh-btn {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
    }

    .refresh-btn i {
        margin-right: 0.5rem;
    }

    .refresh-btn:hover i {
        animation: spin 0.5s ease-in-out;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

document.head.appendChild(refreshStyles);

// Add refresh button when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addRefreshButton();
    }, 1000);
});

// Add this to your script.js
// Auto-update stats when new certifications are added
function updateCertificationStats() {
    statsCalculator.calculateCertifications();
    statsCalculator.updateStatsDisplay();
}

// Optional: Add a manual refresh button for stats
function addStatsRefreshButton() {
    const aboutStats = document.querySelector('.about-stats');
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn btn-secondary stats-refresh-btn';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Update Stats';
    refreshBtn.style.marginTop = '1rem';
    refreshBtn.onclick = () => {
        statsCalculator.init();
    };
    
    aboutStats.appendChild(refreshBtn);
}

// Add CSS for the refresh button
const statsStyles = document.createElement('style');
statsStyles.textContent = `
    .stats-refresh-btn {
        font-size: 0.8rem;
        padding: 0.5rem 1rem;
        margin-top: 1rem;
        grid-column: 1 / -1;
        justify-self: center;
    }
`;
document.head.appendChild(statsStyles);

// LinkedIn Profile Image Loader
class LinkedInImageLoader {
    constructor() {
        this.profileImage = document.getElementById('profile-image');
        this.imageLoading = document.querySelector('.image-loading');
        this.linkedinProfileUrl = 'https://www.linkedin.com/in/christopherlipina/';
    }

    async loadProfileImage() {
        try {
            // Since we can't directly access LinkedIn images due to CORS,
            // we'll use a fallback approach with a professional placeholder
            // or you can manually set your LinkedIn profile image URL here
            
            // Option 1: Use a direct LinkedIn image URL (if you have it)
            // You can get this by right-clicking your LinkedIn profile photo and copying the image URL
            const linkedinImageUrl = 'https://media.licdn.com/dms/image/v2/D5635AQEckcQE0xIWyw/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1733338001557?e=1753340400&v=beta&t=14AARtmYyWC7HASrw60s0DZZDM5Xnlheba46uN7uRMk';
            
            // Option 2: Use GitHub avatar as fallback (since it's accessible)
            const githubImageUrl = 'https://avatars.githubusercontent.com/u/83620137?v=4';
            
            // Option 3: Use a professional stock photo or your own hosted image
            const fallbackImageUrl = 'https://avatars.githubusercontent.com/u/83620137?v=4';
            
            // Try to load GitHub avatar first (most reliable)
            const response = await fetch(githubImageUrl);
            if (response.ok) {
                this.setProfileImage(githubImageUrl);
            } else {
                // Use fallback professional image
                this.setProfileImage(fallbackImageUrl);
            }
        } catch (error) {
            console.error('Error loading profile image:', error);
            // Use fallback professional image
            const fallbackImageUrl = 'https://avatars.githubusercontent.com/u/83620137?v=4';
            this.setProfileImage(fallbackImageUrl);
        }
    }

    setProfileImage(imageUrl) {
        if (this.profileImage) {
            this.profileImage.onload = () => {
                // Hide loading indicator and show image
                this.profileImage.style.opacity = '1';
                if (this.imageLoading) {
                    this.imageLoading.style.opacity = '0';
                    setTimeout(() => {
                        this.imageLoading.style.display = 'none';
                    }, 300);
                }
            };
            
            this.profileImage.onerror = () => {
                // If image fails to load, keep the icon
                console.warn('Profile image failed to load, keeping placeholder');
            };
            
            this.profileImage.src = imageUrl;
        }
    }

    // Method to manually set LinkedIn image URL
    setLinkedInImage(imageUrl) {
        this.setProfileImage(imageUrl);
    }
}

// Initialize LinkedIn image loader
const linkedinImageLoader = new LinkedInImageLoader();

// Update the DOMContentLoaded event listener to include image loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');
    
    // Load profile image
    linkedinImageLoader.loadProfileImage();
    
    // Initialize stats calculator
    statsCalculator.init();
    
    // Add any additional initialization here
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Function to manually update profile image (for easy updates)
function updateProfileImage(imageUrl) {
    linkedinImageLoader.setLinkedInImage(imageUrl);
}

// Add CSS styles for the profile image
const profileImageStyles = document.createElement('style');
profileImageStyles.textContent = `
    .profile-image-container {
        position: relative;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto;
        border: 4px solid var(--accent-color);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .profile-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .image-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        color: var(--text-secondary);
        transition: opacity 0.3s ease;
    }
    
    .image-loading i {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }
    
    @media (max-width: 768px) {
        .profile-image-container {
            width: 200px;
            height: 200px;
        }
        
        .image-loading {
            font-size: 3rem;
        }
    }
`;
document.head.appendChild(profileImageStyles);