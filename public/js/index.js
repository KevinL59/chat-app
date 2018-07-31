
var socket = io();

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
