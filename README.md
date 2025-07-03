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
## Viewing the Website Locally

`index.html` fetches `publications.json`, so it must be served over HTTP. Start a small web server and open the page from `http://localhost:8080`:

```bash
npx http-server
# or
python3 -m http.server
```

