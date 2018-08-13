const expect = require("expect");
const axios  = require("axios");
const slashCommand = require("slash-command");

const geocodeAddress = require("../utils/geocoding");
const weather      = require("../slash-commands/commands/weather");

jest.mock("axios");
jest.mock("../utils/geocoding");

afterEach(() => {
    geocodeAddress.geocodeAddress.mockRestore();
    axios.get.mockRestore();
});

const weatherCommand = slashCommand("/weather 45 rue du barillet 60190 hemevillers");

var location = {
    latitude: 49.46409,
    longitude: 2.673309,
    address: "Hemevillers, France"
};

const res = {
    data:{
        currently: {
            temperature: 70,
            summary: "Sunny"
        }                 
    }
};


describe("test weather function", () => {

    it("should return a sentence describing the weather for the given address.", async () => {

        geocodeAddress.geocodeAddress.mockResolvedValue(location);        
        axios.get.mockResolvedValue(res);

        await expect(weather.action(weatherCommand)).resolves.toBe(
            "Currently at Hemevillers, France, it's sunny with 21.11°C"
        );
    });

    it("should return a sentence describing the weather for the given lat/lng", async () => {
        
        const latlongWeatherCommand = slashCommand("/weather 49.46409 2.673309");
        
        geocodeAddress.geocodeAddress.mockResolvedValue(location);        
        axios.get.mockResolvedValue(res);

        await expect(weather.action(latlongWeatherCommand)).resolves.toBe(
            "Currently at 49.46 lat - 2.67 lon, it's sunny with 21.11°C"
        );
    });

    it("should return an error because geocodeAddress function throw an error", async () => {
        const messageError1 = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";
        const messageError2 = "Aie ... I can't recognize your address.";
        const fakeWeatherCommand = slashCommand("/weather pokefpnoanzodjanzdjnaodnpgh");

        geocodeAddress.geocodeAddress.mockRejectedValue(Error(messageError1));
        await expect(weather.action(weatherCommand)).rejects.toEqual(
            Error(messageError1)
        );
        geocodeAddress.geocodeAddress.mockRestore();

        geocodeAddress.geocodeAddress.mockRejectedValue(Error(messageError2));
        await expect(weather.action(fakeWeatherCommand)).rejects.toEqual(
            Error(messageError2)
        );
    });

    it("should throw an error because there is a problem while fetching forecastio server.", async () => {

        geocodeAddress.geocodeAddress.mockResolvedValue(location);
        axios.get.mockRejectedValue({
            response: {
                status: 404,
                statusText: "Service unknow"
            }
        });

        await expect(weather.action(weatherCommand)).rejects.toEqual(
            Error("A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.")
        );
    });

    it("should return an error message because there is no arguments.", async () => {
        const emptyWeatherCommand = slashCommand("/weather");

        await expect(weather.action(emptyWeatherCommand)).rejects.toEqual(
            Error("Your command contains neither an address nor a lat/long tuple.<br> Please try again or use /weather/help for more informations about this command.")
        );
    });

    it("should return the help message.", () => {
        const helpMessage = [
            "Get weather information for a given address:",
            "/weather [<i>my awesome address</i>]",
            "or",
            "/weather <i>lat</i> <i>long</i>",
            "",
            "Example: <strong>/weather Paris France</strong>",
            "",
            "Use /weather/me to be the only receiver of the weather forecast message."
        ].join("<br>");
        
        expect(weather.help()).toBe(helpMessage);      
    });
});