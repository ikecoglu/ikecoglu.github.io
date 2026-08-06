# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm ci          # Install dependencies (matches CI)
npm test        # Run Jest test suite
```

Local development requires an HTTP server (not `file://`) because `main.js` fetches `publications.json` via `fetch()`:

```bash
npx http-server .
# or
python3 -m http.server 8080
```

Node.js 18.x is required (see `.nvmrc`).

## Architecture

This is a zero-build static personal website deployed on GitHub Pages. There is no bundler, transpiler, or build step — all files are served as-is.

**Runtime flow:**

1. `index.html` renders the page shell with an empty `#publications-list` div.
2. Deferred scripts load: `sortPublications.js` (UMD module), then `main.js`.
3. `DOMContentLoaded` triggers `main.js`, which:
   - Calls `updateFreshnessCues()` to stamp the current year and last-modified date into the footer.
   - Fetches `publications.json` (CSL-JSON format), sorts via `sortPublications()`, and renders each entry with `renderPublication()` into `#publications-list`.

**Key source files:**

| File | Role |
|---|---|
| `index.html` | Page structure, Bootstrap CDN, CSP meta tag, JSON-LD schema |
| `main.js` | `loadPublications`, `renderPublication`, `buildDoiUrl`, `updateFreshnessCues` |
| `sortPublications.js` | Pure, non-mutating sort — newest first; supports `issued.date-parts` and `year` fallback |
| `publications.json` | Publication data in CSL-JSON format; fetched at runtime |
| `styles.css` | Custom styles (Bootstrap 5 is the base) |

**Adding a publication:** add a CSL-JSON object to `publications.json`. Required fields: `title`, `author` (array). Sorting uses `issued.date-parts[0][0]`; if absent, falls back to `year`. Missing dates sort last.

**Tests** live in `__tests__/sortPublications.test.js` and cover `sortPublications.js` only (ordering, non-mutation, missing/mixed date formats). `main.js` has no automated tests; verify DOM rendering manually with a local HTTP server.

**CI** runs `npm ci && npm test` on every push/PR to `main` via `.github/workflows/test.yml`.
