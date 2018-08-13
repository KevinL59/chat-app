const {commandAvailable} = require("./command-loader");

var processCommand = async (params) => {

    // Command is not available.
    if (!commandAvailable[params.command]) {
        return {
            command: params.command,
            status : "ERROR",
            text: `Command ${params.slashcommand} unavailable.`
        };
    }

    // Command is available.
    try {
        // Subcommand is help, so display help message
        if (params.subcommands && params.subcommands[0] === "help") {
            return {
                command: params.command,
                status: "HELP",
                text: commandAvailable[params.command].help()
            };
        }
        else if (params.subcommands && params.subcommands[0] === "me") {
            return {
                command: params.command,
                status: "MESSAGE_ME",
                text: await commandAvailable[params.command].action(params),
            };
        }
        else {
            return {
                command: params.command,
                status: "MESSAGE",
                text: await commandAvailable[params.command].action(params),
            };
        }
    } catch (err) {
        return {
            command: params.command,
            status : "ERROR",
            text: err.message
        };
    }
};

module.exports = {  
    processCommand
};