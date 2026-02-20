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
    function getSortYear(pub) {
      const rawYear = (pub.issued && pub.issued['date-parts'] && pub.issued['date-parts'][0] && pub.issued['date-parts'][0][0]) ?? pub.year;
      const numericYear = Number(rawYear);
      return Number.isFinite(numericYear) ? numericYear : Number.NEGATIVE_INFINITY;
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
