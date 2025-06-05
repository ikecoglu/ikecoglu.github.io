function sortPublications(publications) {
  return publications.sort((a, b) => {
    const yearA = (a.issued && a.issued['date-parts'] && a.issued['date-parts'][0] && a.issued['date-parts'][0][0]) || a.year;
    const yearB = (b.issued && b.issued['date-parts'] && b.issued['date-parts'][0] && b.issued['date-parts'][0][0]) || b.year;
    return yearB - yearA;
  });
}

module.exports = { sortPublications };
