import TWEEN from "@tweenjs/tween.js";
import _ from 'lodash';

export default class State{
    constructor(animationSpeedMessage,animationSpeedLocation){
        this.animationSpeedMessage=animationSpeedMessage;
        this.animationSpeedLoaction=animationSpeedLocation;
        this.messages={};
        this.users={};

        this._lastTick=0;
        requestAnimationFrame((time)=>this._animate(time));
    }

    updateMessages(data){
        for(let message of data){
            if(this.messages[message.id]){
                message.attention=1;
                this.messages[message.id]=Object.assign(this.messages[message.id],message);
            }else{
                message.user=this.users[message.user_id];
                message.attention=1;
                if(message.target_id && this.users[message.target_id]){
                    message.target=this.users[message.target_id];
                    message.location=Object.assign({},message.user.location);
                    this._interpolateMessage(message.location,message.target.location,message.id);
                }

                this.messages[message.id]=message;
            }
        }
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
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth
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
        let deleteIds=[];
        for(let message of _.values(this.messages)){
            message.attention-=deltaTime/1000*1/5;
            if(message.attention<0){
               deleteIds.push(message.id);
            }
        }

        for(let id of deleteIds){
           delete this.messages[id];
        }

        this._lastTick=time;
    }

    updateUsers(data){
        for(let user of data){
            if(this.users[user.id]){
                //assume that only the location can change
                this._interpolateLocation(this.users[user.id].location,user.location);
            }else{
                this.users[user.id]=user;
            }
        }
    }

    getUsers(){
        return Object.values(this.users);
    }

    getMessages(){
        return Object.values(this.messages);
    }

    getAnswers(){

    }
}