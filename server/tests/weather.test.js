const expect = require("expect");
const axios  = require("axios");

const geocodeAddress = require("../utils/geocoding");
const {weather}      = require("../commands/weather");

jest.mock("axios");
jest.mock("../utils/geocoding");


describe("test weather function", () => {

    it("should return a sentence describing the weather for the given address.", async () => {
        var location = {
            latitude: 49.46409,
            longitude: 2.673309
        };
        const res = {
            data:{
                currently: {
                    temperature: 70,
                    summary: "Sunny"
                }                 
            }
        };
        
        geocodeAddress.geocodeAddress.mockResolvedValue(location);        
        axios.get.mockResolvedValue(res);

        await expect(weather(["45", "rue", "du", "barillet", "60190", "hemevillers"])).resolves.toMatchObject({
            status: "OK",
            text: "Currently, at the address you given, it's Sunny with 21.11°C"
        });

        geocodeAddress.geocodeAddress.mockRestore();
        axios.get.mockRestore();
    });

    it("should return a sentence describing the weather for the given lat/lng", async () => {
        var location = {
            latitude: 49.46409,
            longitude: 2.673309
        };
        const res = {
            data:{
                currently: {
                    temperature: 70,
                    summary: "Sunny"
                }                 
            }
        };
        
        geocodeAddress.geocodeAddress.mockResolvedValue(location);        
        axios.get.mockResolvedValue(res);

        await expect(weather(["49.46409", "2.673309"])).resolves.toMatchObject({
            status: "OK",
            text: "Currently, at the address you given, it's Sunny with 21.11°C"
        });
        geocodeAddress.geocodeAddress.mockRestore();
        axios.get.mockRestore();
    });

    it("should return an error because geocodeAddress function throw an error", async () => {
        const messageError1 = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";
        const messageError2 = "Aie ... I can't recognize your address.";
        
        geocodeAddress.geocodeAddress.mockRejectedValue(Error(messageError1));

        await expect(weather(["45", "rue", "du", "barillet", "60190", "hemevillers"])).rejects.toEqual(
            Error(messageError1)
        );
        geocodeAddress.geocodeAddress.mockRestore();

        geocodeAddress.geocodeAddress.mockRejectedValue(Error(messageError2));

        await expect(weather(["pokefpnoanzodjanzdjnaodnpgh"])).rejects.toEqual(
            Error(messageError2)
        );
        geocodeAddress.geocodeAddress.mockRestore();
    });

    it("should throw an error because there is a problem while fetching forecastio server.", async () => {
        var location = {
            latitude: 49.46409,
            longitude: 2.673309
        };

        geocodeAddress.geocodeAddress.mockResolvedValue(location);
        axios.get.mockRejectedValue({
            response: {
                status: 404,
                statusText: "Service unknow"
            }
        });

        await expect(weather(["45", "rue", "du", "barillet", "60190", "hemevillers"])).rejects.toEqual(
            Error("A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.")
        );
    });
});