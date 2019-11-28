const _ =require('lodash');

class Users{
    constructor(){
        this.users={};
    }

    add(user){
        this.users[user.id]=user;
    }

    delete(user){
        delete this.users[user.id];
    }

    getActives(){
        return _.values(this.users).filter(user=>!user.deleted);
    }

    getAll(){
        return _.values(this.users);
    }

    getWsData(){
       return _.values(this.users).map(user => user.getWSData());
    }
}

module.exports=Users;