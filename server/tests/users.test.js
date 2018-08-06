var expect = require("expect");

var {Users} = require("../utils/users");

describe("Users", () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: "Nicolas",
            room: "Node Course"
        },{
            id: 2,
            name: "Julie",
            room: "Node Course"
        },{
            id: 3,
            name: "Antoine",
            room: "React Course"
        }];
    });

    it("should add a user to the users array.", () => {
        var users = new Users();
        var user = {
            id: 1234,
            name: "Kevin",
            room: "Test"
        };
        users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it("should remove user", () => {
        var userId = 1;
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
        expect(users).not.toContain(users.users[0]);
    });

    it("should not remove user", () => {
        var userId = 99;
        var user = users.removeUser(userId);

        expect(user).toBe(undefined);
        expect(users.users.length).toBe(3);
    });

    it("should find user", () => {
        var userId = 2;
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it("should not find user", () => {
        var userId = 99;
        var user = users.getUser(userId);

        expect(user).toBe(undefined);
    });

    it("should return the list of user name for Node Course room.", () => {
        var userNameList = users.getUserNameList("Node Course");

        expect(userNameList).toEqual(["Nicolas", "Julie"]);
    });

    it("should return the list of user name for React Course room.", () => {
        var userNameList = users.getUserNameList("React Course");

        expect(userNameList).toEqual(["Antoine"]);
    });

    it("should return the list of unique room names.", () => {
        var roomNameList = users.getUniqueRoomNameList();

        expect(roomNameList.length).toBe(2);
        expect(roomNameList).toEqual(["Node Course", "React Course"]);
    });

    it("should return true because the name already exists in NodeJs Course", () => {
        var isAlreadyExist = users.isNameAlreadyInRoom("Nicolas", "Node Course");

        expect(isAlreadyExist).toBe(true);
    });

    it("should return false because the name doesn't already exist in NodeJs Course", () => {
        var isAlreadyExist = users.isNameAlreadyInRoom("Kevin", "Node Course");

        expect(isAlreadyExist).toBe(false);
    });
});