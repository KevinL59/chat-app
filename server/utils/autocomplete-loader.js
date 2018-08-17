const fs = require("fs");
const path = require("path");

const emojiKeyLoader = () => {
    const emojiPictures = fs.readdirSync(path.join(__dirname, "../../public/img/emojis")); 
    return emojiPictures.map(emoji => emoji.substring(0, emoji.length-4));
};

const commandNameLoader = () => {
    const commandName = fs.readdirSync(path.join(__dirname, "../slash-commands/commands")); 
    return commandName.map(command => command.substring(0, command.length-3));
};

module.exports = {
    emojiKeyLoader,
    commandNameLoader
};
