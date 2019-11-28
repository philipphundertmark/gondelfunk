const uniqid = require("uniqid");

export default class Message{
    constructor(){

    }

    static create(content,user_id,target_id){
        let message=new Message();
        message.id=uniqid();
        message.user_id=user_id;
        message.target_id=target_id;
        message.message=content;

        return message;
    }
}