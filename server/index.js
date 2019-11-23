const cors = require('cors');
const express = require('express');
const http = require("http");
const api = require('./api');
const ws = require("./websocket");

const BASE_URL = '/api';

// Create an express app.
const app = express();

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS.
app.use(cors());

// Express middleware that parses incoming requests with JSON payloads.
app.use(express.json());

// Serve the built react app
// app.use(express.static("build"));

// Mount the actual API router on the base url.
app.use(BASE_URL, api);

const server = http.createServer(app);

ws.init(server);

setInterval(() => {
  ws.broadcast("Test");
}, 5000);

(async function() {
  /**
   * TODO: Connect to redis here
   */

  const port = process.env.PORT || 8000;

  server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
})();
