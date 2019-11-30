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
        }, 1500);

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

            let random_user_id=_.sample(this.users.getActives().map(user => user.id));
            let target_id=null;
            if(Math.random()<0.2 && random_user_id!==user.id){
                target_id=random_user_id;
            }

            let message={
                timestamp: Date.now(),
                id: uniqid(),
                message: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
                user_id: user.id,
                target_id: target_id
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
      /*  for(let message of _.values(this.messages)){
            if(currentTime-message.timestamp>MAX_AGE_MESSAGE){
                delete this.messages[message.id];
            }
        }*/

        for(let user of this.users.getAll()){
            if(currentTime-user.timestamp>MAX_AGE_USER_DELETED){
                this.users.delete(user);
            }
        }

    }
}
  
module.exports = new Store();