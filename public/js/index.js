
var socket = io();

function isRealString (string) {
    return typeof string == "string" && string.trim().length > 0;
}

function fireAlert (message) {
    var template = jQuery("#alert-modal").html();
    // var template = jQuery("#alert-message").html();
    var alert = Mustache.render(template, {
        title: "Woaaa! Not so fast",
        message
    });
    
    jQuery("#alert").html(alert);
    jQuery("#modal").modal({
        keyboard: true
    });

    // var alertDiv = jQuery("#alert").append(alert);
    // alertDiv.hide().removeClass("hidden").slideDown();
    // jQuery(".page-alert .close").click(function(e) {
    //     e.preventDefault();
    //     alertDiv.slideUp();
    //     alertDiv.html("");
    // });
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
                jQuery("#room-name-label").text("Or give a name for a new room");
            }
        }
        else {
            console.log("No room list available");
        }
    });
});

jQuery("#join-form").on("submit", function (event) {
    event.preventDefault();

    var userName = jQuery("[name=userName]").val();
    var roomNameList = jQuery("[name=roomNameList]").val();
    var roomName = jQuery("[name=roomName]").val();

    // First, we check if roomName contain a value
    if (!isRealString(roomName)){
        // if not, we assign to it value of roomName list if exist or "" if not
        roomName = roomNameList || "";
    }

    if (!isRealString(userName)){
        fireAlert("Your user name is not valid or empty.");
    }
    else if (!isRealString(roomName)){ 
        fireAlert("Your room name is not valid or empty.");
    }
    else {
        socket.emit("isUserAlreadyInRoom",{
            userName,
            roomName: roomName.toLowerCase()
        }, function (errorMessage) {
            if (errorMessage) {
                fireAlert("This username is already used by someone in this room.");
            }
            else {
                window.location.href = `/chat.html?userName=${userName}&roomName=${roomName.toLowerCase()}`;
            }
        });
    }
});