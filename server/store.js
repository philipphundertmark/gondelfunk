const ws = require('./websocket');
const _ = require('lodash');
const uniqid = require("uniqid");
const Users = require('./users');

const MAX_AGE_MESSAGE=60000;
const MAX_AGE_USER_DELETED=60000;
const CLEANUP_INTERVAL=5000;

class Store {
    constructor() {
        this.users = new Users();
        this.messages={};
        this.initLoop();
    }

    initLoop() {
        this.timer = setInterval(() => {
            console.log("Move users");

            const usersUpdate = JSON.stringify({
                type: "user",
                data: this.users.getWsData()
            });

            const messageUpdate = JSON.stringify({
                type:"message",
                data: _.values(this.messages)
            });

            ws.broadcast(usersUpdate);
            ws.broadcast(messageUpdate);
        }, 1000);

        this.cleanupInterval = setInterval(()=>{
            this.cleanup();
        },CLEANUP_INTERVAL)
    }

    generateMessageData(count){
        for(let i=0;i<count;i++) {
            let user=_.sample(this.users.getActives());

            if(!user){
                return;
            }

            let message={
                timestamp: Date.now(),
                id: uniqid(),
                message: "Test" + Math.round(Math.random() * 1000),
                user_id: user.id,
                target_id: Math.random() > 0.1 ? _.sample(this.users.getActives().map(user => user.id)) : null
            };

            this.messages[message.id]=message;
        }
    }


    addUser(user) {
        this.users.add(user);
    }

    //removes old messages and inactive users
    cleanup(){
        let currentTime=Date.now();
        for(let message of _.values(this.messages)){
            if(currentTime-message.timestamp>MAX_AGE_MESSAGE){
                delete this.messages[message.id];
            }
        }

        for(let user of this.users.getAll()){
            if(currentTime-user.timestamp>MAX_AGE_USER_DELETED){
                this.users.delete(user);
            }
        }

    }
}
  
module.exports = new Store();