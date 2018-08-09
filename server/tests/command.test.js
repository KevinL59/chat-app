var expect = require("expect");
var slashCommand = require("slash-command");

var {processCommand} = require("../slash-commands/manager");
var weather = require("../slash-commands/commands/weather");

jest.mock("../slash-commands/commands/weather");

describe("processCommand tests", () => {

    it("should find weather command and process it", async () => {
        const command = slashCommand("/weather 45 rue du barillet Hemevillers");

        const returnValue = {
            text: "test return value",
            status: "OK"
        };

        weather.weather.mockResolvedValue(returnValue);
        
        await expect(processCommand(command)).resolves.toMatchObject(returnValue);
    });

    it("should return an status ERROR because the command is unknowed.", async () => {
        var command = slashCommand("/fakeCommand");
        
        await expect(processCommand(command)).resolves.toMatchObject({
            status: "ERROR",
            text: `Command ${command.slashcommand} unavailable.`
        });
    });

    it("should return an status ERROR because the command throw an error.", async () => {
        var command = slashCommand("/weather 45 rue du barillet Hemevillers");
        
        weather.weather.mockRejectedValue(Error("An error occur during the command"));

        await expect(processCommand(command)).resolves.toMatchObject({
            status: "ERROR",
            text: "An error occur during the command"
        });
    });
});