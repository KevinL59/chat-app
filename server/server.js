const path = require("path");
const http = require("http");

const socketIo = require("socket.io");
const express  = require("express");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIo(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected.");

    socket.emit("newMessage", {
        from: "Admin",
        text: "Welcome to the chat app!",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "A new user join the chat!",
        createdAt: new Date().getTime()
    });

    socket.on("createMessage", (message) => {
        console.log("createMessage", message);
        // io.emit("newMessage", {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
        socket.broadcast.emit("newMessage", {
            from: "kevin@exemple.com",
            text: "My new Email!",
            createdAt: 123
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected.");
    });
});

server.listen(port, () => {
    console.log(`Listening on PORT ${port}!`);
});