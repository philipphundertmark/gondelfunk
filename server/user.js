const tracks = require('./tracks');

class User {
    constructor(id, age, gender, track) {
        this.id = id;
        this.age = age;
        this.gender = gender;
        this.role = 1;

        this.trackId = track;
        this.track = tracks[track];

        this.location = {
            x: this.track.start[0], 
            y: this.track.start[1]
        };
    }

    getWSData() {
        return {
            id: this.id,
            age: this.age,
            sex: this.gender,
            role: this.role,
            location: this.location
        }
    }

    move() {
        // console.log(`Move user with id ${this.id}`);
        // TODO:
        const { x, y } = this.location;

        this.location = {
            x: x + 10,
            y: y + 10,
        };
    }

    addTimer(timer) {
        this.timer = timer;
    }
}

module.exports = User;