const tracks = require('./tracks');

const SPEED=40;

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
        if(this.deleted){
            return;
        }
        const { x, y } = this.location;

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