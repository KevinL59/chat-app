var socket = io();

socket.on("connect", function () {
    console.log("New connection to the server");

    // socket.emit("createMessage", {
    //     from: "nicolas@exemple.com",
    //     text: "My new Email!",
    // });
});

socket.on("disconnect", function () {
    console.log("disconnect from the server");
});

socket.on("newMessage", function (message) {
    console.log("newMessage", message);
    var li = jQuery("<li></li>");
    li.text(`${message.from}: ${message.text}`);

    jQuery("#messages").append(li);
});

jQuery("#message-form").on("submit", function (event) {
    event.preventDefault();
    socket.emit("createMessage", {
        from: "User",
        text: jQuery("[name=message]").val()
    }, function () {
        
    });
});