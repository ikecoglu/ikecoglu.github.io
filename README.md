# Testing Setup

This project uses [Jest](https://jestjs.io/) for basic unit tests. To run the tests:
Node.js 18.x is recommended. An `.nvmrc` file is provided for use with `nvm`.

1. Install dependencies once:

   ```bash
   npm install
   ```

2. Run the test suite:

   ```bash
   npm test
   ```

The test suite currently validates that the publication sorting logic orders entries from newest to oldest.

### CI lockfile checklist (GitHub Actions)

This repo's CI uses `npm ci`, which requires a committed `package-lock.json`.

1. Generate/update the lockfile locally:

   ```bash
   npm install
   ```

2. Confirm `package-lock.json` exists and is updated.
3. Commit both `package-lock.json` and any `package.json` changes in the same commit.
4. Push again so GitHub Actions can run `npm ci` deterministically.

If the lockfile is missing, CI fails before tests run.
## Viewing the Website Locally

`index.html` fetches `publications.json`, so it must be served over HTTP. Start a small web server and open the page from `http://localhost:8080`:

```bash
npx http-server
# or
python3 -m http.server
```
