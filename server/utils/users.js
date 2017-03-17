class Users {
    constructor () {
        this.users = [];
    }

    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    
    removeUser (id) {
        var user = this.getUser(id);
        
        if (user) {
            var i = this.users.indexOf(user);
            this.users.splice(i, 1);
        }
        return user;
    }
    
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    
    getUserList (room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        return namesArray;
    }
    
    getAllUserNames() {
        return this.users.map((user) => user.name.toLowerCase());
    }
}

module.exports = {Users};