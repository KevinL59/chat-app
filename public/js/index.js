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

socket.on("newLocationMessage", function (message) {
    console.log("newMessage", message);
    
    var a = jQuery("<a target=\"_blank\">My current location</a>");
    a.attr("href", message.url);
    
    var li = jQuery("<li></li>");
    li.text(`${message.from}: `);
    li.append(a);

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

var locationButton = jQuery("#send-location");
locationButton.on("click", function () {
    if(!navigator.geolocation) {
        return alert("Geolocation is not available on your brower.");
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
    }, function () {
        alert("Unable to fetch your location.");
    });
});