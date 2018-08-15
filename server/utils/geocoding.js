const axios = require("axios");

const errorMessage = "A problem occurs with the weather command. Please contact the Admin <a href=\"https://github.com/KevinL59\">Kevin L</a>.";

var geocodeAddress = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const locationiqPrivateToken = process.env.LOCATIONIQ_API_TOKEN;

    const locationiqUrl = `https://eu1.locationiq.com/v1/search.php?key=${locationiqPrivateToken}&q=${encodedAddress}&format=json`;

    try {
        var response = await axios.get(locationiqUrl);
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error("Aie ... I can't recognize your address.");
        }
        throw new Error(errorMessage);
    }

    var location =  {
        address: response.data[0].display_name,
        latitude: response.data[0].lat,
        longitude: response.data[0].lon
    };
        
    return location;
};

module.exports = {
    geocodeAddress
};