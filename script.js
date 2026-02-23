// Load and render all content when page loads
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    renderHeroBadges(data.hero.badges);
    renderJourney(data.journey);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderCertificates(data.certificates);
    renderRecentCourses(data.certificates);
  } catch (error) {
    console.error("Error loading portfolio data:", error);
  }
});

// Format ISO date to readable format (2025-12-12 → Dec 12, 2025)
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Sort certificates by date (most recent first)
function sortCertificatesByDate(certificates) {
  return [...certificates].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Hero Badges
function renderHeroBadges(badges) {
  const container = document.getElementById("tech-badges");
  container.innerHTML = badges
    .map((badge) => `<span class="badge">${badge}</span>`)
    .join("");
}

// Journey Cards
function renderJourney(journeyItems) {
  const container = document.getElementById("journey-grid");
  container.innerHTML = journeyItems
    .map(
      (item) => `
        <div class="journey-card">
            <div class="icon">${item.icon}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
    `,
    )
    .join("");
}

// Recent Courses (automatically from 3 most recent certificates)
function renderRecentCourses(certificates) {
  const container = document.getElementById("recent-courses");
  const sortedCerts = sortCertificatesByDate(certificates);
  const recentCourses = sortedCerts.slice(0, 3);

  container.innerHTML = recentCourses
    .map(
      (course) => `
        <div class="course-item">
            <span class="course-check">✓</span>
            <div class="course-info">
                <h4>${course.title}</h4>
                <div class="course-meta">${course.hours} hours • Completed ${formatDate(course.date)}</div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Skills Grid
function renderSkills(skills) {
  const container = document.getElementById("skills-grid");
  container.innerHTML = skills
    .map(
      (skill) => `
        <div class="skill-category">
            <h3>${skill.icon} ${skill.category}</h3>
            <div>
                ${skill.tags.map((tag) => `<span class="skill-tag">${tag}</span>`).join("")}
            </div>
        </div>
    `,
    )
    .join("");
}

// Projects Grid
function renderProjects(projects) {
  const container = document.getElementById("projects-grid");
  const featuredProjects = projects.filter((p) => p.featured);

  container.innerHTML = featuredProjects
    .map(
      (project) => `
        <div class="project-card">
            ${project.hasLiveDemo ? '<div class="project-badge"><span class="badge-live">🚀 Live Demo</span></div>' : ""}
            <div class="project-header">
                <h3>${project.title}</h3>
            </div>
            <div class="project-body">
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map((tech) => `<span class="tech-badge">${tech}</span>`).join("")}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="project-link">→ View Code</a>
                    ${project.githubFrontend ? `<a href="${project.githubFrontend}" target="_blank" class="project-link">→ Frontend</a>` : ""}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-link project-link-primary">→ Live Demo</a>` : ""}
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Certificates (Recent and Archived)
function renderCertificates(certificates) {
  const recentContainer = document.getElementById("recent-certificates");
  const archivedContainer = document.getElementById("archived-certificates");
  const countText = document.getElementById("cert-count-text");

  // Sort all certificates by date (most recent first)
  const sortedCerts = sortCertificatesByDate(certificates);

  // Split into recent (first 3) - mas archived terá TODOS
  const recentCerts = sortedCerts.slice(0, 3);

  // Update certificate count dynamically
  if (countText) {
    countText.textContent = `View All Certifications (${certificates.length} total)`;
  }

  // Render certificates
  recentContainer.innerHTML = recentCerts
    .map((cert) => createCertificateCard(cert))
    .join("");
  // Archived mostra TODOS (incluindo os 3 recentes)
  archivedContainer.innerHTML = sortedCerts
    .map((cert) => createCertificateCard(cert))
    .join("");
}

function createCertificateCard(cert) {
  return `
        <div class="certificate-card">
            <div class="cert-header">🎓</div>
            <div class="cert-body">
                <h3 class="cert-title">${cert.title}</h3>
                <div class="cert-provider">${cert.provider}</div>
                <div class="cert-date">${formatDate(cert.date)}${cert.hours ? " • " + cert.hours + " hours" : ""}</div>
                <div class="cert-tech">
                    <strong>Tech:</strong> ${cert.tech}
                </div>
                <div class="cert-links">
                    ${cert.repository ? `<a href="${cert.repository}" target="_blank">→ Repository</a>` : ""}
                    ${cert.demo ? `<a href="${cert.demo}" target="_blank">→ Live Demo</a>` : ""}
                    <a href="${cert.certificate}" target="_blank">→ View Certificate</a>
                </div>
            </div>
        </div>
    `;
}
