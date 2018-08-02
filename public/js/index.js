
var socket = io();

function isRealString (string) {
    return typeof string == "string" && string.trim().length > 0;
}

function fireAlert (message) {
    var template = jQuery("#alert-message").html();
    var html = Mustache.render(template, {message});
    jQuery("#alert").html(html);
    jQuery("#alert").removeAttr("style");
}

socket.on("connect", function () {

    socket.emit("getRoomList", function (roomNameList) {
        if (roomNameList) {
            if (roomNameList.length > 0){    
                var roomSelect = jQuery("#room-name-list");
                roomNameList.forEach(function (name) {
                    roomSelect.append(jQuery(`<option value="${name}"></option>`).text(name));
                });
                jQuery("#room-name-select").removeAttr("style");
                jQuery("#room-name-label").text("Or name of the new room");
            }
        }
        else {
            console.log("No room list available");
        }
    });
});

jQuery("#join-form").on("submit", function (event) {
    event.preventDefault();

    var displayName = jQuery("[name=displayName]").val();
    var roomNameList = jQuery("[name=roomNameList]").val();
    var roomName = jQuery("[name=roomName]").val();

    // First, we check if roomName contain a value
    if (!isRealString(roomName)){
        // if not, we assign to it value of roomName list if exist or "" if not
        roomName = roomNameList || "";
    }

    if (!isRealString(displayName) || !isRealString(roomName)){
        fireAlert("Display name or room name are not valid.");
    }
    else {
        socket.emit("isUserAlreadyInRoom",{
            displayName,
            roomName: roomName.toLowerCase()
        }, function (errorMessage) {
            if (errorMessage) {
                fireAlert("This userName is already used in this room.");
            }
            else {
                window.location.href = `/chat.html?displayName=${displayName}&roomName=${roomName.toLowerCase()}`;
            }
        });
    }
});
