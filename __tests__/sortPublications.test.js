const { sortPublications } = require('../assets/js/sortPublications');

describe('sortPublications', () => {
  test('orders publications from newest to oldest', () => {
    const publications = [
      { title: 'Old Paper', year: 2019 },
      { title: 'New Paper', year: 2021 },
      { title: 'Middle Paper', year: 2020 }
    ];

    const sorted = sortPublications([...publications]);

    expect(sorted.map(p => p.title)).toEqual(['New Paper', 'Middle Paper', 'Old Paper']);
  });

  test('does not mutate the input array', () => {
    const publications = [
      { title: 'Old Paper', year: 2019 },
      { title: 'New Paper', year: 2021 }
    ];
    const originalOrder = publications.map((p) => p.title);

    const sorted = sortPublications(publications);

    expect(publications.map((p) => p.title)).toEqual(originalOrder);
    expect(sorted).not.toBe(publications);
    expect(sorted.map((p) => p.title)).toEqual(['New Paper', 'Old Paper']);
  });

  test('handles missing issued/year by sorting those entries last', () => {
    const publications = [
      { title: 'Missing Date A' },
      { title: 'Dated', year: 2022 },
      { title: 'Missing Date B', year: null }
    ];

    const sorted = sortPublications(publications);

    expect(sorted.map((p) => p.title)).toEqual(['Dated', 'Missing Date A', 'Missing Date B']);
  });

  test('supports mixed issued date-parts and year formats', () => {
    const publications = [
      { title: 'From Year Number', year: 2020 },
      { title: 'From Issued', issued: { 'date-parts': [[2023, 5, 1]] } },
      { title: 'From Year String', year: '2021' },
      { title: 'Invalid Issued', issued: { 'date-parts': [['unknown']] }, year: 2018 }
    ];

    const sorted = sortPublications(publications);

    expect(sorted.map((p) => p.title)).toEqual([
      'From Issued',
      'From Year String',
      'From Year Number',
      'Invalid Issued'
    ]);
  });
});
