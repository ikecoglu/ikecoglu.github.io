# Project Notes

This repository hosts a static personal website built around two core files:
- `index.html` (site markup and client-side rendering)
- `publications.json` (publication metadata consumed by the page)

## Prerequisites

- Node.js 18.x (recommended via `.nvmrc`)
- npm

## Setup

```bash
# if you use nvm
nvm use

# install dependencies from lockfile (same behavior as CI)
npm ci
```

## Testing

Tests are written with [Jest](https://jestjs.io/) and currently validate `sortPublications.js` behavior for:
- newest-to-oldest ordering
- non-mutating sort behavior
- missing/invalid date handling
- mixed `issued.date-parts` and `year` formats

Run tests with:

```bash
npm test
```

## CI (GitHub Actions)

Workflow file: `.github/workflows/test.yml`

On push/PR to `main`, CI runs:
1. `npm ci`
2. `npm test`

> `npm ci` requires a committed `package-lock.json`. If `package-lock.json` is missing or stale relative to `package.json`, CI fails before tests run.

## Viewing Locally

Because `index.html` fetches `publications.json`, serve the repository over HTTP (not `file://`):

```bash
npx http-server
# or
python3 -m http.server 8080
```

Then open the printed local URL in your browser.
