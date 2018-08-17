const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const express  = require("express");
const slashCommand = require("slash-command");

require("./config/config");
const {generateMessage, generateLocationMessage, styleMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");
const {processCommand} = require("./slash-commands/manager");
const {emojiKeyLoader, commandNameLoader} = require("./utils/autocomplete-loader");

const publicPath = path.join(__dirname, "../public");

var app = express();
var server = http.createServer(app);
var io = socketIo(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected.");

    socket.on("join", (params, callback) => {
        if (!isRealString(params.userName) || !isRealString(params.roomName)){
            callback({err: "Display name or room name are not valid."});
        }
        else if (users.isNameAlreadyInRoom(params.userName, params.roomName)){
            callback({err: "This name is already used by somebody in this room."});
        }
        else {
            socket.join(params.roomName);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.userName, params.roomName);

            io.to(params.roomName).emit("updateUserList", users.getUserNameList(params.roomName));
            socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app!"));
            socket.broadcast
                .to(params.roomName)
                .emit("newMessage", generateMessage("Admin", `${params.userName} join the chat!`));
            
            callback({
                emojis: emojiKeyLoader(),
                commands: commandNameLoader()
            });
        }
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

    socket.on("isUserAlreadyInRoom", (params, callback) => {
        if (users.isNameAlreadyInRoom(params.userName, params.roomName)){
            callback("This name is already used by somebody in this room.");
        }
        else{
            callback();
        }
    });

    socket.on("slashCommand", (params, callback) => {
        var user = users.getUser(socket.id);

        processCommand(slashCommand(params.text)).then((message) => {
            if (message.status !== "MESSAGE"){
                socket.emit("newMessage", generateMessage(message.command, styleMessage(message.text, message.status)));
            }
            else {
                io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
            }
        });

        callback();
    });

    socket.on("isTyping", () => {
        var user = users.getUser(socket.id);
        socket.broadcast
            .to(user.room)
            .emit("noticeTyping", user.name);
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

server.listen(process.env.PORT, () => {
    console.log(`Listening on PORT ${process.env.PORT}!`);
});