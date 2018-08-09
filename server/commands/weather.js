const axios = require("axios");
const {geocodeAddress} = require("../utils/geocoding");

const forecastUrl = "https://api.forecast.io/forecast/";
const forecastApiKey = "91cc898820c23f594d54fd0efc9ab57a";

const errorMessage = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";

const weather = async (params) => {
    var location = {};

    if (params.length === 2 && params.every(item => !isNaN(parseFloat(item)))) {
        location = {
            latitude: params[0],
            longitude: params[0]
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
            text: `Currently, at the address you given, it's ${response.data.currently.summary} with ${tempCelsius}°C`
        };
    } catch (err) {
        throw new Error(errorMessage);
    }  
};

module.exports = {
    weather,
};
