var expect = require("expect");

var {geocodeAddress} = require("../utils/geocoding");

const axios  = require("axios");
jest.mock("axios");

describe("test geocodeAddress function", () => {
    
    it("should return latitude and longitude", async () => {
        const res = {
            data:{
                results: [ 
                    { 
                        formatted_address: "45 Rue du Barillet 60190 Hemevillers",
                        geometry: {
                            location: {
                                lat: 49.46409,
                                lng: 2.673309
                            }
                        }
                    }
                ],
                status: "OK"                 
            }
        };
        axios.get.mockResolvedValue(res);
        var address = "45 rue du barillet 60190 Hemevillers";
        await expect(geocodeAddress(address)).resolves.toMatchObject({
            latitude: 49.46409,
            longitude: 2.673309
        });
    });

    it("should not recognize the addres and throw Error", async () => {
        const res = {
            data:{
                results: [],
                status: "ZERO_RESULTS"                 
            }
        };
        axios.get.mockResolvedValue(res);

        var fakeAddress = "pefjfnoinojfNHPZORNOfn";
        
        await expect(geocodeAddress(fakeAddress)).rejects.toEqual(
            Error("Aie ... I can't recognize your address.")
        );
    });

    it("should return an error because return status is not OK", async () => {
        const res = {
            data:{
                results: [],
                status: "OVER_QUERY_LIMIT"                 
            }
        };
        axios.get.mockResolvedValue(res);
        
        var address = "45 rue du barillet 60190 Hemevillers";
        
        await expect(geocodeAddress(address)).rejects.toThrowError();
    });

    it("should return an error because something goes wrong during the axios queries", async () => {
        axios.get.mockImplementation(() => Promise.reject(Error()));
        
        var address = "45 rue du barillet 60190 Hemevillers";
        
        await expect(geocodeAddress(address)).rejects.toThrowError();
    });
});

