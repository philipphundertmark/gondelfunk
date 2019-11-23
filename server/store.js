const ws = require('./websocket');

class Store {
    constructor() {
        this.users = [];

        this.initLoop();
    }

    initLoop() {
        this.timer = setInterval(() => {
            console.log("Move users");

            const usersUpdate = JSON.stringify({
                type: "user",
                data: this.users.map(user => user.getWSData())
            });

            ws.broadcast(usersUpdate);
        }, 1000);
    }

    get(key) {
        return this.users[key];
    }

    addUser(user) {
        this.users.push(user);
    }
}
  
module.exports = new Store();