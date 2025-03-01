// Navigation
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const menuToggle = document.querySelector('.menu-toggle');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show/hide sections
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });

        // Close mobile menu if open
        if (menuToggle && document.querySelector('.nav-links').classList.contains('active')) {
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Hamburger menu toggle for mobile
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

// Fetch and display GitHub projects
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/TorientalVortX/repos');
        const repos = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        repos.slice(0, 6).forEach(repo => {  // Limiting to 6 projects for display
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <a href="${repo.html_url}" target="_blank">View on GitHub</a>
            `;
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '<p>Unable to load projects at this time.</p>';
    }
}

// Load projects when the page loads
window.addEventListener('load', fetchGitHubProjects);