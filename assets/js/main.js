// Apply stored theme before paint to avoid flash
(function () {
  const stored = localStorage.getItem('theme');
  if (stored) document.documentElement.setAttribute('data-bs-theme', stored);
})();

let fadeInObserver;

function initScrollAnimations() {
  fadeInObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeInObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );
  document.querySelectorAll('.fade-in').forEach((el) => fadeInObserver.observe(el));
}

function observeNewFadeIns(container) {
  if (!fadeInObserver) return;
  container.querySelectorAll('.fade-in').forEach((el) => fadeInObserver.observe(el));
}

function initActiveNav() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function update() {
    let current = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 100) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initDarkMode() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const icon = toggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  applyTheme(localStorage.getItem('theme') || 'light');
}

async function loadPublications() {
  const publicationsList = document.getElementById('publications-list');

  function setStatusMessage(message, className) {
    publicationsList.textContent = '';
    const p = document.createElement('p');
    if (className) {
      p.className = className;
    }
    p.textContent = message;
    publicationsList.appendChild(p);
  }

  function buildDoiUrl(rawDoi) {
    if (!rawDoi) {
      return null;
    }
    const doi = String(rawDoi).trim();
    if (!doi) {
      return null;
    }
    return `https://doi.org/${doi}`;
  }

  function renderPublication(pub) {
    const item = document.createElement('div');
    item.className = 'publication-item mb-4 p-4 fade-in';

    const title = document.createElement('h5');
    title.className = 'publication-title';
    title.textContent = pub.title || 'Untitled';

    const authorsText = Array.isArray(pub.author)
      ? pub.author
          .map((author) => `${author.given || ''} ${author.family || ''}`.trim())
          .filter(Boolean)
          .join(', ')
      : (pub.author || '');

    const authors = document.createElement('p');
    authors.className = 'authors text-muted mb-1';
    authors.textContent = authorsText;

    const venueText = pub['container-title'] || pub.journal || '';
    const yearText = pub.issued?.['date-parts']?.[0]?.[0] || pub.year || '';

    const venue = document.createElement('p');
    venue.className = 'venue mb-2';
    const em = document.createElement('em');
    em.textContent = venueText;
    venue.appendChild(em);
    if (yearText) {
      venue.append(`, ${yearText}`);
    }

    item.appendChild(title);
    item.appendChild(authors);
    item.appendChild(venue);

    const doiUrl = buildDoiUrl(pub.DOI || pub.doi);
    if (doiUrl) {
      const link = document.createElement('a');
      link.href = doiUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btn btn-sm btn-outline-primary';
      link.textContent = 'View Publication';
      item.appendChild(link);
    }

    return item;
  }

  try {
    const response = await fetch('data/publications.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let publications = await response.json();
    publications = sortPublications(publications);

    publicationsList.textContent = '';
    if (!publications || publications.length === 0) {
      setStatusMessage('No publications found.');
      return;
    }

    const fragment = document.createDocumentFragment();
    publications.forEach((pub) => {
      fragment.appendChild(renderPublication(pub));
    });
    publicationsList.appendChild(fragment);
    observeNewFadeIns(publicationsList);
  } catch (error) {
    console.error('Error loading publications:', error);
    setStatusMessage(`Error loading publications: ${error.message}`, 'text-danger');
  }
}

function updateFreshnessCues() {
  function getDocumentLastModifiedDate() {
    const raw = typeof document.lastModified === 'string' ? document.lastModified.trim() : '';
    if (!raw) {
      return null;
    }

    const parsedTimestamp = Date.parse(raw);
    if (!Number.isNaN(parsedTimestamp)) {
      return new Date(parsedTimestamp);
    }

    // Safari/locale-specific fallbacks can return unparseable strings.
    const usPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/;
    const usMatch = raw.match(usPattern);
    if (usMatch) {
      const month = Number(usMatch[1]) - 1;
      const day = Number(usMatch[2]);
      const year = Number(usMatch[3]);
      const hour = Number(usMatch[4]);
      const minute = Number(usMatch[5]);
      const second = usMatch[6] ? Number(usMatch[6]) : 0;
      const date = new Date(year, month, day, hour, minute, second);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
  }

  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = String(new Date().getFullYear());
  }

  const lastUpdatedElement = document.getElementById('last-updated');
  if (lastUpdatedElement) {
    const lastModified = getDocumentLastModifiedDate() || new Date();
    const formatted = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(lastModified);
    lastUpdatedElement.textContent = formatted;
    lastUpdatedElement.setAttribute('datetime', lastModified.toISOString());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initScrollAnimations();
  initActiveNav();
  updateFreshnessCues();
  loadPublications();
});
