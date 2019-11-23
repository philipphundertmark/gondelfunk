const WS = require("ws");

class WebSocket {
  init(server) {
    this.wss = new WS.Server({ server });
  }

  broadcast(data) {
    if (!this.wss) {
      throw new Error("WebSocketServer not initialized");
    }
    this.wss.clients.forEach(client => {
      if (client.readyState === WS.OPEN) {
        client.send(JSON.stringify({ data }));
      }
    });
  }
}

module.exports = new WebSocket();