const cors = require('cors');
const express = require('express');
const http = require("http");
const uniqid = require("uniqid");
const api = require('./api');
const User = require('./user');
const store = require('./store');
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
  if (Math.random() < 0.6) {
    console.log("No user this time");
    return;
  }
  
  console.log("Create user");
  
  const userId = uniqid("user-");

  const user = new User(
    // id
    userId,
    // id
    Math.floor(Math.random() * (50 - 18 + 1)) + 18,
    // gender
    Math.random() < 0.5 ? "venus" : "mars",
    // track
    Math.floor(Math.random() * 3)
  );

  const timer = setInterval(() => {
    user.move();
    
    ws.broadcast({
      type: "location",
      id: user.id
    })
  }, 1000);

  user.addTimer(timer);

}, 2000)

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
