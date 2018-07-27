var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = jQuery("#messages");
    var newMessage = messages.children("li:last-child");
    // Heights
    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");
    // Height of the new li messages.
    var newMessageHeight = newMessage.innerHeight();
    //Height of the message just before the last one.
    var lastMessageHeight = newMessage.prev().innerHeight();
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", function () {
    console.log("New connection to the server");
    var params = jQuery.deparam(window.location.search);

    socket.emit("join", params, function (err) {
        if (err) {
            alert(err);
            window.location.href = "/";
        }
        else {
            console.log("No error.");
        }
    });
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
    scrollToBottom();
});

socket.on("newLocationMessage", function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    jQuery("#messages").append(html);
    scrollToBottom();
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