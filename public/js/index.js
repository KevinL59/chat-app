var socket = io();

socket.on("connect", function () {
    console.log("New connection to the server");

    socket.emit("createMessage", {
        from: "nicolas@exemple.com",
        text: "My new Email!",
    });
});

socket.on("disconnect", function () {
    console.log("disconnect from the server");
});

socket.on("newMessage", function (message) {
    console.log("newMessage", message);
});