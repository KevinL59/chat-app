const {weather} = require("./weather");

const commandAvailable = {
    weather
};

var processCommand = async (params) => {

    if (!commandAvailable[params.command]){
        return {
            status : "ERROR",
            text: `Command ${params.slashcommand} unavailable.`
        };
    }

    try {
        return await commandAvailable[params.command](params.body.split(" "));
    } catch (err) {
        return {
            status : "ERROR",
            text: err.message
        };
    }
};

module.exports = {  
    processCommand
};