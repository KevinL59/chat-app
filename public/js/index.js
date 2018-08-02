
var socket = io();

function isRealString (string) {
    return typeof string == "string" && string.trim().length > 0;
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

// jQuery("#join-form").on("submit", function (event) {
//     event.preventDefault();

//     var displayName = jQuery("[name=displayName]");
//     var roomNameList = jQuery("[name=roomNameList]").val();
//     var roomName = jQuery("[name=roomName]");

//     if (!isRealString(displayName) || !isRealString(roomName)){
//         callback("Display name or room name are not valid.");
//     }
//     else if (users.isNameAlreadyInRoom(displayName, roomName)){
//         callback("This name is already used by somebody in this room.");
//     }
//     socket.emit("createMessage", {
//         from: "User",
//         text: messageTextBox.val()
//     }, function () {
//         messageTextBox.val("");
//     });
// });
