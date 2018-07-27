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
    console.log("newMessage", message);
    var li = jQuery("<li></li>");
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function (message) {
    console.log("newMessage", message);
    var formattedTime = moment(message.createdAt).format("h:mm a");

    var a = jQuery("<a target=\"_blank\">My current location</a>");
    a.attr("href", message.url);
    
    var li = jQuery("<li></li>");
    li.text(`${message.from} ${formattedTime}: `);
    li.append(a);

    jQuery("#messages").append(li);
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