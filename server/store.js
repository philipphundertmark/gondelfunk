/**
 * Very simple in-memory key-value-store to share values among different modules.
 */
class Store {
    constructor() {
        this.users = [];
    }

    get(key) {
        return this.users[key];
    }

    set(key, value) {
        this.users[key] = value;
    }
}
  
module.exports = new Store();