(function (root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.sortPublications = api.sortPublications;
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
      ? self
      : this,
  function () {
    function toFiniteYear(value) {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      const year = Number(value);
      return Number.isFinite(year) ? year : null;
    }

    function getSortYear(pub) {
      const issuedYear = toFiniteYear(
        pub.issued &&
          pub.issued['date-parts'] &&
          pub.issued['date-parts'][0] &&
          pub.issued['date-parts'][0][0]
      );

      if (issuedYear !== null) {
        return issuedYear;
      }

      const fallbackYear = toFiniteYear(pub.year);
      return fallbackYear !== null ? fallbackYear : Number.NEGATIVE_INFINITY;
    }

    function sortPublications(publications) {
      return publications
        .map((pub, index) => ({ pub, index, sortYear: getSortYear(pub) }))
        .sort((a, b) => {
          if (b.sortYear !== a.sortYear) {
            return b.sortYear - a.sortYear;
          }
          return a.index - b.index;
        })
        .map((entry) => entry.pub);
    }

    return { sortPublications };
  }
);
