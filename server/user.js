const tracks = require('./tracks');

const SPEED=15;

class User {
    constructor(id, age, gender, track) {
        this.id = id;
        this.age = age;
        this.gender = gender;
        this.role = 1;
        this.deleted=false;
                                                                   
        this.trackId = track;
        this.track = tracks[track];

        this.location = {
            x: this.track.start[0], 
            y: this.track.start[1]
        };

        this.tick=0;
    }

    getWSData() {
        return {
            id: this.id,
            age: this.age,
            sex: this.gender,
            role: this.role,
            location: this.location,
            deleted:this.deleted
        }
    }

    move() {
        this.tick++;
        if(this.deleted){
            return;
        }

        let endX=this.track.end[0];
        let endY=this.track.end[1];

        let dx=endX-this.location.x;
        let dy=endY-this.location.y;

        let norm=Math.sqrt(dx*dx+dy*dy);

        if(Math.abs(dx)+Math.abs(dy)<40){
            this.deleted=true;
        }

        this.location.x+=dx/norm*SPEED;
        this.location.y+=dy/norm*SPEED;
    }

    addTimer(timer) {
        this.timer = timer;
    }
}

module.exports = User;