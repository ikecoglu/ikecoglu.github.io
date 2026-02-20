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
    return `https://doi.org/${encodeURIComponent(doi)}`;
  }

  function renderPublication(pub) {
    const item = document.createElement('div');
    item.className = 'publication-item mb-4 p-4';

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
    const response = await fetch('publications.json');
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
  updateFreshnessCues();
  loadPublications();
});
