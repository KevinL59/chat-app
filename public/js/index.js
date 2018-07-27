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

    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    jQuery("#messages").append(html);
});

socket.on("newLocationMessage", function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    jQuery("#messages").append(html);
});

jQuery("#message-form").on("submit", function (event) {
    event.preventDefault();

    var messageTextBox = jQuery("[name=message]");

    socket.emit("createMessage", {
        from: "User",
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val("");
    });
});

var locationButton = jQuery("#send-location");
locationButton.on("click", function () {
    if(!navigator.geolocation) {
        return alert("Geolocation is not available on your brower.");
    }

    locationButton.attr("disabled", "disabled").text("Sending location...");

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr("disabled").text("Send location");
    }, function () {
        alert("Unable to fetch your location.");
        locationButton.removeAttr("disabled").text("Send location");
    });
});