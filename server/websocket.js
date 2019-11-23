const WS = require("ws");

class WebSocket {
  init(server) {
    this.wss = new WS.Server({ server });

    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        console.log('received: %s', message);
        this.broadcast(message);
      });
    });
  }

  broadcast(data) {
    console.log(data);
    if (!this.wss) {
      throw new Error("WebSocketServer not initialized");
    }
    this.wss.clients.forEach(client => {
      if (client.readyState === WS.OPEN) {
        client.send(data);
      }
    });
  }
}

module.exports = new WebSocket();
