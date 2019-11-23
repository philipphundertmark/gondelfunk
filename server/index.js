const cors = require('cors');
const express = require('express');
const api = require('./api');

const BASE_URL = '/api';

// Create an express app.
const app = express();

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS.
app.use(cors());

// Express middleware that parses incoming requests with JSON payloads.
app.use(express.json());

// Mount the actual API router on the base url.
app.use(BASE_URL, api);

(async function() {
  /**
   * TODO: Connect to redis here
   */

  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
})();
