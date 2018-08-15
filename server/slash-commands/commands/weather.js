const axios = require("axios");
const {geocodeAddress} = require("../../utils/geocoding");

const forecastUrl = "https://api.forecast.io/forecast/";
const forecastApiKey = process.env.FORECAST_API_KEY;

const errorMessage = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";

const action = async (command) => {
    
    if (!command.body) {
        throw new Error(["Your command contains neither an address nor a lat/long tuple.<br>",
            " Please try again or use /weather/help for more informations about this command."].join(""));    
    }
    
    var location = {};
    const args = command.body.split(" ");

    if (args.length === 2 && args.every(item => !isNaN(parseFloat(item)))) {
        location = {
            latitude: args[0],
            longitude: args[1],
            address: `${parseFloat(args[0]).toFixed(2)} lat - ${parseFloat(args[1]).toFixed(2)} lon`
        };
    }
    else {
        try {
            location = await geocodeAddress(args.join(" "));
        } catch (err) {
            throw err;
        }
    }
    try {
        var response = await axios.get(`${forecastUrl}${forecastApiKey}/${location.latitude},${location.longitude}`);
        var tempCelsius = ((response.data.currently.temperature - 32) / 1.8).toFixed(2);
        return `Currently at ${location.address}, it's ${response.data.currently.summary.toLowerCase()} with ${tempCelsius}°C`;
    } catch (err) {
        throw new Error(errorMessage);
    }  
};

const help = () => {
    return [
        "Get weather information for a given address:",
        "/weather [<i>my awesome address</i>]",
        "or",
        "/weather <i>lat</i> <i>long</i>",
        "",
        "Example: <strong>/weather Paris France</strong>",
        "",
        "Use /weather/me to be the only receiver of the weather forecast message."
    ].join("<br>");
};

module.exports = {
    action,
    help,
};
