const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const express  = require("express");

var {generateMessage, generateLocationMessage} = require("./utils/message");
var {isRealString} = require("./utils/validation");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIo(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected.");

    socket.on("join", (params, callback) => {
        if (!isRealString(params.displayName) || !isRealString(params.roomName)){
            callback("Display name or room name are not valid.");
        }

        socket.join(params.roomName);
        
        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app!"));

        socket.broadcast
            .to(params.roomName)
            .emit("newMessage", generateMessage("Admin", `${params.displayName} join the chat!`));
        
        callback();
    });

    socket.on("createMessage", (message, callback) => {
        console.log("createMessage", message);
        io.emit("newMessage", generateMessage(message.from, message.text));
        callback("This is from the server.");
    });

    socket.on("createLocationMessage", (location) => {
        io.emit("newLocationMessage", generateLocationMessage("Admin", location.latitude, location.longitude));
    });

    socket.on("disconnect", () => {
        console.log("User disconnected.");
    });
});

server.listen(port, () => {
    console.log(`Listening on PORT ${port}!`);
});