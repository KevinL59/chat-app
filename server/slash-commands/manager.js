const {commandAvailable} = require("./command-loader");

var processCommand = async (params) => {

    if (!commandAvailable[params.command]){
        return {
            status : "ERROR",
            text: `Command ${params.slashcommand} unavailable.`
        };
    }

    try {
        if (params.subcommands && params.subcommands[0] === "help"){
            return {
                status: "OK",
                text: commandAvailable[params.command].helpMessage
            };
        }
        return await commandAvailable[params.command][params.command](params.body.split(" "));
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