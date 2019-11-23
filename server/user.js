const tracks = require('./tracks');

console.log(tracks);

class User {
    constructor(id, age, gender, track) {
        this.id = id;
        this.age = age;
        this.gender = gender;
        this.trackId = track;

        this.track = tracks[track];

        this.location = [this.track.start, this.track.end];
    }

    move() {
        console.log(`Move user with id ${this.id}`);
    }

    addTimer(timer) {
        this.timer = timer;
    }
}

module.exports = User;