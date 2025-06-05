const { sortPublications } = require('../sortPublications');

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
});
