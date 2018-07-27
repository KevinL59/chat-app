class Users {
    constructor () {
        this.users = [];
    }

    addUser (id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser (id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser (id) {
        return this.users.filter((item) => item.id === id)[0];
    }

    getUserList (room) {
        var users = this.users.filter((item) => {
            return item.room === room; 
        });
        return users;
    }

    getUserNameList (room) {
        var users = this.getUserList(room);
        return users.map((item) => item.name);
    }
}

module.exports = {
    Users
};