class User {
    constructor(id, age, gender, track) {
        this.id = id;
        this.age = age;
        this.gender = gender;
        this.track = track;
    }

    get(key) {
        return this.users[key];
    }

    set(key, value) {
        this.users[key] = value;
    }
}

module.exports = User;