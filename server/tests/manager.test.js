var expect = require("expect");
var slashCommand = require("slash-command");

var {processCommand} = require("../slash-commands/manager");
var weather = require("../slash-commands/commands/weather");

jest.mock("../slash-commands/commands/weather");

describe("processCommand tests", () => {

    it("should find weather command and process it", async () => {
        const command = slashCommand("/weather 45 rue du barillet Hemevillers");

        const returnValue = {
            command: command.command,
            text: "test return value",
            status: "MESSAGE"
        };

        weather.action.mockResolvedValue("test return value");
        
        await expect(processCommand(command)).resolves.toEqual(returnValue);
    });

    it("should return an status ERROR because the command is unknowed.", async () => {
        var command = slashCommand("/fakeCommand");
        
        await expect(processCommand(command)).resolves.toEqual({
            command: command.command,
            status: "ERROR",
            text: `Command ${command.slashcommand} unavailable.`
        });
    });

    it("should return an status ERROR because the command throw an error.", async () => {
        var command = slashCommand("/weather 45 rue du barillet Hemevillers");
        
        weather.action.mockRejectedValue(Error("An error occur during the command"));

        await expect(processCommand(command)).resolves.toEqual({
            command: command.command,
            status: "ERROR",
            text: "An error occur during the command"
        });
    });

    it("should return object construct for user display only", async () => {
        const command = slashCommand("/weather/me 45 rue du barillet Hemevillers");

        const returnValue = {
            command: command.command,
            text: "This message will be display to the user only!",
            status: "MESSAGE_ME"
        };

        weather.action.mockResolvedValue(returnValue.text);
        
        await expect(processCommand(command)).resolves.toEqual(returnValue);
    });

    it("should help subcommand of a command", async () => {
        const command = slashCommand("/weather/help");

        const text = "help function of the command weather";

        weather.help = jest.fn(() => text);
        
        expect(processCommand(command)).resolves.toEqual({
            command: command.command,
            status: "HELP",
            text
        });
    });
});