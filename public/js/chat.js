var socket = io();

const audio = new Audio("../audio/light.mp3");

var userTyping = new Set();
var isTyping = false;

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

function renderTypingInfos () {
    var typingDiv = jQuery("#typing-info");

    var userTypingArray = Array.from(userTyping);

    if (userTypingArray.length === 0) {
        typingDiv.html("");
    }
    else if (userTypingArray.length === 1) {
        typingDiv.html(`<p>${userTypingArray.join("")} is typing.</p>`);
    }
    else {
        var typingString = userTypingArray.slice(0, (userTypingArray.length - 1)).join(", ");
        typingDiv.html(`<p>${typingString} and ${userTypingArray[userTypingArray.length - 1]} are typing.</p>`);
    }
}

function setAutocomplete (emojisKey, commandName) {
    jQuery("#message-input").atwho({
        at: ":",
        data: emojisKey,
        displayTpl: "<li>${name} <img src='../img/emojis/${name}.png' height='20' width='20' class='emoji'/></li>",
        insertTpl: ":${name}:",
        delay: 400,
        limit: 10
    }).atwho({
        at: "/",
        data: commandName,
        // displayTpl: "${name}",
        insertTpl: "/${name}",
        maxLen: 2,
    });
}

socket.on("connect", function () {
    console.log("New connection to the server");
    var params = jQuery.deparam(window.location.search);
    
    socket.emit("join", {
        userName: params.userName,
        roomName: params.roomName
    }, function (data) {
        if (data.err) {
            alert(data.err);
        }
        else {
            console.log(data.emojis, data.commands);
            setAutocomplete(data.emojis, data.commands);
        }
    });
}); 

socket.on("disconnect", function () {
    console.log("disconnect from the server");
});

socket.on("updateUserList", function(userArray) {
    var ol = jQuery("<ol> </ol>");
    userArray.forEach(function (name) {
        ol.append(jQuery("<li></li>").text(name));
    });
    jQuery("#users").html(ol);
});

socket.on("newMessage", function (message) {

    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime
    });

    jQuery("#messages").append(html);

    var msgText = jQuery("#text-message");
    msgText.html(message.text);
    msgText.removeAttr("id");

    scrollToBottom();

    userTyping.delete(message.from);
    renderTypingInfos();

    if(document.visibilityState !== "visible" && message.from !== "Admin"){
        audio.play();
    }
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

socket.on("noticeTyping", function (user) {
    userTyping.add(user);
    renderTypingInfos();

    setTimeout(()=>{
        userTyping.delete(user);
        renderTypingInfos();
    }, 15000);
});

jQuery("#message-input").on("input", function () {
    if (!isTyping) {
        isTyping = true;
        socket.emit("isTyping");
    } 
    setTimeout(() => {
        isTyping = false;
    }, 15000);
});

jQuery("#message-form").on("submit", function (event) {
    event.preventDefault();

    var messageTextBox = jQuery("[name=message]");

    if (messageTextBox.val().trim().startsWith("/")){
        socket.emit("slashCommand", {
            text: messageTextBox.val()
        }, function () {
            isTyping = false;
            messageTextBox.val("");
        });
    }
    else {
        socket.emit("createMessage", {
            text: messageTextBox.val()
        }, function () {
            isTyping = false;
            messageTextBox.val("");
        });
    }  
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

// "https://assets-cdn.github.com/images/icons/emoji/" 