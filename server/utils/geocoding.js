const axios = require("axios");

const errorMessage = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";

var geocodeAddress = async (address) => {
    const googleMapsUrl  = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    const encodedAddress = encodeURIComponent(address);
    
    try {
        var response = await axios.get(`${googleMapsUrl}${encodedAddress}`);
    } catch (err) {
        throw new Error(errorMessage);
    }

    if(response.data.status === "ZERO_RESULTS"){
        throw new Error("Aie ... I can't recognize your address.");
    }
    else if (response.data.status !== "OK") {
        throw new Error(errorMessage);
    }
    
    var location =  {
        address: response.data.results[0].formatted_address,
        latitude: response.data.results[0].geometry.location.lat,
        longitude: response.data.results[0].geometry.location.lng
    };

    return location;
};

module.exports = {
    geocodeAddress
};