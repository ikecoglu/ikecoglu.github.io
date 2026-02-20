function sortPublications(publications) {
  const getSortYear = (pub) => {
    const rawYear = (pub.issued && pub.issued['date-parts'] && pub.issued['date-parts'][0] && pub.issued['date-parts'][0][0]) ?? pub.year;
    const numericYear = Number(rawYear);
    return Number.isFinite(numericYear) ? numericYear : Number.NEGATIVE_INFINITY;
  };

  const sorted = publications
    .map((pub, index) => ({ pub, index, sortYear: getSortYear(pub) }))
    .sort((a, b) => {
      if (b.sortYear !== a.sortYear) {
        return b.sortYear - a.sortYear;
      }
      return a.index - b.index;
    })
    .map((entry) => entry.pub);

  publications.splice(0, publications.length, ...sorted);
  return publications;
}

module.exports = { sortPublications };
