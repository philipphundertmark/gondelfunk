export default class State{
    constructor(){
        this.messages={};
        this.users={};
    }

    updateMessages(data){
        for(let message of data){
            if(this.users[message.id]){
                this.messages[message.id]=Object.assign(this.messages[message.id],message);
            }else{
                message.user=this.users[message.user_id];
                if(message.target_id){
                    message.target=this.messages[message.target_id];
                }

                this.messages[message.id]=message;
            }
        }
    }

    _interpolateLocation(location,target){

    }

    updateUsers(data){
        for(let user of data){
            if(this.users[user.id]){
                this.users[user.id]=Object.assign(this.users[user.id],user);
            }else{
                this.users[user.id]=user;
            }
        }
    }

    tick(delta){

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