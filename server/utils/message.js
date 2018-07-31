var moment = require("moment");
var emojis = require("emojis");

var generateMessage = (from, text) => {
    return {
        from,
        text: emojis.html(text, "./img/emojis/"),
        createdAt: moment().valueOf()
    };
};

var generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};