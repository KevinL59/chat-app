const axios = require("axios");
const {geocodeAddress} = require("../../utils/geocoding");

const forecastUrl = "https://api.forecast.io/forecast/";
const forecastApiKey = process.env.FORECAST_API_KEY;

const errorMessage = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";

const weather = async (params) => {
    var location = {};

    if (params.length === 2 && params.every(item => !isNaN(parseFloat(item)))) {
        location = {
            latitude: params[0],
            longitude: params[1],
            address: `${parseFloat(params[0]).toFixed(2)} lat - ${parseFloat(params[1]).toFixed(2)} lon`
        };
    }
    else {
        try {
            location = await geocodeAddress(params.join(" "));
        } catch (err) {
            throw err;
        }
    }
    try {
        var response = await axios.get(`${forecastUrl}${forecastApiKey}/${location.latitude},${location.longitude}`);
        var tempCelsius = ((response.data.currently.temperature - 32) / 1.8).toFixed(2);
        return {
            status: "OK",
            text: `Currently at ${location.address}, it's ${response.data.currently.summary.toLowerCase()} with ${tempCelsius}°C`
        };
    } catch (err) {
        throw new Error(errorMessage);
    }  
};

const helpMessage = [
    "/weather command.",
    "Get weather information for a given address.",
    "/weather <i>my great address</i>",
    "or",
    "/weather <i>lat</i> <i>long</i>",
    "Example: <strong>/weather Paris France</strong>",
].join("<br>");

module.exports = {
    weather,
    helpMessage
};
