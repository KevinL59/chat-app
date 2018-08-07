const axios = require("axios");

const forecastUrl = "https://api.forecast.io/forecast/";
const forecastApiKey = "91cc898820c23f594d54fd0efc9ab57a";

const errorMessage = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";

var geocodeAddress = async (address) => {
    const googleMapsUrl  = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    const encodedAddress = encodeURIComponent(address);
    
    try {
        var response = await axios.get(`${googleMapsUrl}${encodedAddress}`);
    } catch (err) {
        console.log(err);
        throw new Error(errorMessage);
    }

    if(response.data.status === "ZERO_RESULTS"){
        throw new Error("Aie ... I can't recognize your address.");
    }
    else if (response.data.status === "OVER_QUERY_LIMIT") {
        throw new Error(errorMessage);
    }

    var location =  {
        address: response.data.results[0].formatted_address,
        latitude: response.data.results[0].geometry.location.lat,
        longitude: response.data.results[0].geometry.location.lng
    };

    return location;
};

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
            throw new Error(err);
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
        console.log("Unable to connect to Forecast.io server:");
        console.log(`Status code: ${err.response.status}`);
        console.log(`Status text: ${err.response.statusText}`);
        throw new Error(errorMessage);
    } 
    
};

module.exports = {
    weather,
    geocodeAddress
};
