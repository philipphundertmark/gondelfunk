/**
 * Very simple in-memory key-value-store to share values among different modules.
 */
class Store {
    constructor() {
        this.store = {};
    }

    get(key) {
        return this.store[key];
    }

    set(key, value) {
        this.store[key] = value;
    }
}
  
module.exports = new Store();