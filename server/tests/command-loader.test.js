const implementjs = require("implement-js");
const implement = implementjs.default;
const { Interface, type } = implementjs;

const {commandAvailable} = require("../slash-commands/command-loader");

const Command = Interface("Command")({
    action: type("function"),
    help: type("function")
}, { error: true });

describe("Test if all command implemant Command Interface.", () => {

    it("should not send error because all command implement Interface Command", (done) => {

        const allCommandName = Object.keys(commandAvailable);
        
        allCommandName.forEach((commandName) => {
            implement(Command)(commandAvailable[commandName]);
        });

        done();
    });
});