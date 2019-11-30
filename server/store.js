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
                data: this.generateMessageData(_.random(0,3))
            });

            ws.broadcast(usersUpdate);
            ws.broadcast(messageUpdate);
        }, 1500);

        this.cleanupInterval = setInterval(()=>{
            this.cleanup();
        },CLEANUP_INTERVAL)
    }

    generateMessageData(count){
        let messages=[];
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

            let content;
            if(Math.random()>0.5){
                content=Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, _.random(5,20));
            }else{
                content="0x"+_.random(0,10).toString();
            }

            let message={
                timestamp: Date.now(),
                id: uniqid(),
                message: content,
                user_id: user.id,
                target_id: target_id
            };

            messages.push(message);
        }

        return messages;
    }


    addUser(user) {
        this.users.add(user);
    }

    //removes old messages and inactive users
    cleanup(){
        let currentTime=Date.now();

        for(let user of this.users.getAll()){
            if(currentTime-user.timestamp>MAX_AGE_USER_DELETED){
                this.users.delete(user);
            }
        }

    }
}
  
module.exports = new Store();