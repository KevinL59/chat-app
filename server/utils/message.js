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

var styleMessage = (text, type=undefined) => {
    switch (type) {
    case "HELP":
        return `<span class="help-message">${text}</span>`;
    case "ERROR":
        return `<span class="error-message">${text}</span>`;
    default:
        return text;
    }
};

module.exports = {
    generateMessage,
    generateLocationMessage,
    styleMessage
};