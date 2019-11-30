import TWEEN from "@tweenjs/tween.js";
import _ from 'lodash';

const MAX_TIME_MESSAGE=5;
const MAX_AGE_MESSAGE=70000;//max time before message is removed from state after deletion
const INTERVAL_CLEANUP=10000;

class State{
    constructor(animationSpeedMessage,animationSpeedLocation){
        this.animationSpeedMessage=animationSpeedMessage;
        this.animationSpeedLoaction=animationSpeedLocation;
        this.messages={};
        this.users={};

        this._lastTick=0;
        this._lastCleanup=0;
        requestAnimationFrame((time)=>this._animate(time));
        this.hash=Math.round(Math.random()*10000);
    }

    _deleteMessages(messages){
        for(let message of messages){
            this.messages[message.id].timestamp=Date.now();
            this.messages[message.id].deleted=true;
        }
    }

    updateMessages(data){
        let currentTime=Date.now();
        for(let message of data){
            if(this.messages[message.id]){
                this.messages[message.id]=Object.assign(this.messages[message.id],message);
            }else{
                message.user=this.users[message.user_id];
                if(!message.user){
                    continue;
                }

                let messagesForUser=this.getMessagesForUser(message.user_id,false,false);
               this._deleteMessages(messagesForUser);

                message.attention=1.;
                if(message.target_id && this.users[message.target_id]){
                    message.target=this.users[message.target_id];
                    message.location=Object.assign({},message.user.location);
                    this._interpolateMessage(message.location,message.target.location,message.id);
                }

                this.messages[message.id]=message;
            }
        }
    }

    getMessagesForUser(user_id,includeResponses=false,includeAnswers=true){
        let messages=[];
        for(let message of this.getMessages()){
            if((includeAnswers && message.target_id===user_id) || (message.user_id===user_id && (includeResponses || (!includeResponses && !message.target_id)))){
                messages.push(message);
            }
        }

        return messages;
    }

    _interpolateLocation(location,target){
        const tween = new TWEEN.Tween(location) // Create a new tween that modifies 'coords'.
            .to(target, this.animationSpeedLoaction) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth
            .start(); // Start the tween immediately.
    }

    _interpolateMessage(from,to,id){
        const tween = new TWEEN.Tween(from) // Create a new tween that modifies 'coords'.
            .to(to, this.animationSpeedMessage) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Linear.None)
            .start() // Start the tween immediately.
            .onComplete(()=>{
                delete this.messages[id];
        })
    }

    _animate(time){
        requestAnimationFrame((time)=>this._animate(time));
        TWEEN.update(time);

        let deltaTime=time-this._lastTick;
        //decay messages
        let messages=this.getMessages();
        for(let message of messages){
            if(!message.target_id) {
                message.attention -= deltaTime / 1000 * 1 / MAX_TIME_MESSAGE;
                if (message.attention < 0) {
                    message.deleted=true;
                }
            }
        }

        this._lastTick=time;
        if(time-this._lastCleanup>INTERVAL_CLEANUP){
            this._cleanup();
            this._lastCleanup=time;
        }
    }

    updateUsers(data){
        for(let user of data){
            if(this.users[user.id]){
                //assume that only the location can change
                if(user.deleted){
                    this._deleteMessages(this.getMessagesForUser(user.id,true,true));
                    delete this.users[user.id]
                }else {
                    this._interpolateLocation(this.users[user.id].location, user.location);
                }
            }else if(!user.deleted){
                this.users[user.id]=user;
            }
        }
    }

    getUsers(){
        return Object.values(this.users);
    }

    getMessages(){
        return Object.values(this.messages).filter(message=>!message.deleted);
    }

    _cleanup(){
        let now=Date.now();
        let messages=_.values(this.messages);
        for(let message of messages){
            if(message.deleted &&now-message.timestamp>MAX_AGE_MESSAGE){
                delete this.messages[message.id];
            }
        }
    }

    getAnswers(){

    }
}

export default new State(5000,1900);