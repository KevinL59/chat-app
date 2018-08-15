const fs = require("fs");
const path = require("path");

var commandAvailable = {};

var files = fs.readdirSync(path.join(__dirname, "./commands")); 
files.forEach((nameFiles) => {
    nameFiles = nameFiles.substring(0, nameFiles.length-3);
    commandAvailable[nameFiles] = require(`./commands/${nameFiles}`);
});


module.exports = {
    commandAvailable
};