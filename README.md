# Project Notes

This repository is a static personal website (`index.html`) with publication data in `publications.json`.

## Testing

Tests are written with [Jest](https://jestjs.io/) and currently cover `sortPublications.js` behavior:
- newest-to-oldest ordering
- non-mutating sort behavior
- missing/invalid date handling
- mixed `issued.date-parts` and `year` formats

Node.js 18.x is recommended (see `.nvmrc`).

```bash
# if you use nvm
nvm use

# install from lockfile (same behavior as CI)
npm ci

# run tests
npm test
```

## CI (GitHub Actions)

Workflow file: `.github/workflows/test.yml`

On push/PR to `main`, CI runs:
1. `npm ci`
2. `npm test`

`npm ci` requires a committed `package-lock.json`. If `package-lock.json` is missing or stale relative to `package.json`, CI fails before tests run.

## Viewing Locally

`index.html` fetches `publications.json`, so open it through an HTTP server (not `file://`):

```bash
npx http-server
# or
python3 -m http.server 8080
```
