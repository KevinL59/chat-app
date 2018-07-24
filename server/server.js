const path = require('path');
const http = require('http');

const socketIo = require('socket.io');
const express  = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIo(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user connected.");

    socket.on('disconnect', () => {
        console.log('User disconnected.')
    })
});

server.listen(port, () => {
    console.log(`Listening on PORT ${port}!`)
})