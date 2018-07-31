const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const express  = require("express");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIo(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected.");

    socket.on("join", (params, callback) => {
        if (!isRealString(params.displayName) || !isRealString(params.roomName)){
            callback("Display name or room name are not valid.");
        }

        socket.join(params.roomName);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.displayName, params.roomName);

        io.to(params.roomName).emit("updateUserList", users.getUserNameList(params.roomName));
        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app!"));
        socket.broadcast
            .to(params.roomName)
            .emit("newMessage", generateMessage("Admin", `${params.displayName} join the chat!`));
        
        callback();
    });

    socket.on("createMessage", (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on("createLocationMessage", (location) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit("newLocationMessage",  generateLocationMessage(user.name, location.latitude, location.longitude));
        }
    });

    socket.on("getRoomList", (callback) => {
        var roomNameList = users.getUniqueRoomNameList();
        if (roomNameList) {
            callback(roomNameList);
        }
        callback();
    });

    socket.on("disconnect", () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("updateUserList", users.getUserNameList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} leave the chat room.`));
        }
        console.log("User disconnected.");
    });
});

server.listen(port, () => {
    console.log(`Listening on PORT ${port}!`);
});