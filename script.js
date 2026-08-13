// Load and render all content when page loads
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    renderHero(data.hero);
    renderJourney(data.journey);
    renderLearning(data.learning);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderCertificates(data.certificates);
    renderRecentCourses(data.certificates);
    renderContact(data.contact);
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

// Hero Section
function renderHero(hero) {
  document.getElementById("hero-title").textContent = hero.name;
  document.getElementById("hero-role").textContent = hero.role;
  document.getElementById("hero-tagline").textContent = hero.tagline;
  const descEl = document.getElementById("hero-description");
  if (Array.isArray(hero.description)) {
    descEl.innerHTML = hero.description
      .map((p) => `<p style="margin-bottom: 1rem;">${p}</p>`)
      .join("");
  } else {
    descEl.textContent = hero.description;
  }

  const badgeContainer = document.getElementById("tech-badges");
  badgeContainer.innerHTML = hero.badges
    .map((badge) => `<span class="badge">${badge}</span>`)
    .join("");
}

// Contact, Footer & Opportunities Section
function renderContact(contact) {
  // Update Opportunity Info
  const oppDesc = document.getElementById("opp-description");
  const oppStatus = document.getElementById("opp-status");

  if (oppDesc) oppDesc.textContent = contact.opportunities.description;
  if (oppStatus) {
    oppStatus.innerHTML = contact.opportunities.status
      .map((status) => `<span class="status-badge">✓ ${status}</span>`)
      .join("");
  }

  // Update All Social/Contact Links (Hero & Footer)
  const links = {
    "link-linkedin": contact.linkedin,
    "link-github": contact.github,
    "link-email": `mailto:${contact.email}`,
    "footer-linkedin": contact.linkedin,
    "footer-github": contact.github,
    "footer-email": `mailto:${contact.email}`,
  };

  for (const [id, url] of Object.entries(links)) {
    const el = document.getElementById(id);
    if (el) el.href = url;
  }

  // Update Copyright Year
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Learning Section
function renderLearning(learning) {
  const title = document.getElementById("learning-title");
  const desc = document.getElementById("learning-description");
  const nextSteps = document.getElementById("learning-next-steps");

  if (title) title.textContent = learning.title;
  if (desc) desc.textContent = learning.description;
  if (nextSteps) {
    nextSteps.innerHTML = learning.nextSteps
      .map((step) => `<span class="next-step-badge">${step}</span>`)
      .join("");
  }
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
                ${
                  project.badges
                    ? `<div class="project-live-badges">${project.badges
                        .map(
                          (badge) =>
                            `<a href="${badge.link}" target="_blank"><img src="${badge.image}" alt="${badge.alt}"></a>`,
                        )
                        .join("")}</div>`
                    : ""
                }
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
