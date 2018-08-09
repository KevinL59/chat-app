var expect = require("expect");

var {geocodeAddress} = require("../utils/geocoding");

const axios  = require("axios");
jest.mock("axios");

describe("test geocodeAddress function", () => {
    
    it("should return latitude and longitude", async () => {
        const res = {
            data: [
                {
                    display_name: "Hemevillers, France",
                    lat: 49.46409,
                    lon: 2.673309           
                }                               
            ]
        };
        axios.get.mockResolvedValue(res);
        var address = "45 rue du barillet 60190 Hemevillers";
        await expect(geocodeAddress(address)).resolves.toMatchObject({
            latitude: 49.46409,
            longitude: 2.673309
        });
    });

    it("should not recognize the address and throw an error.", async () => {
        const err = {
            response:{
                status: 404,
                statusText: "Not found address."
            }
        };
        axios.get.mockRejectedValue(err);

        var fakeAddress = "pefjfnoinojfNHPZORNOfn";
        
        await expect(geocodeAddress(fakeAddress)).rejects.toEqual(
            Error("Aie ... I can't recognize your address.")
        );
    });

    it("should return an error because the locationiq token is not ok.", async () => {
        const err = {
            response:{
                status: 401,
                statusText: "Not found address."
            }
        };
        axios.get.mockRejectedValue(err);
        
        var address = "45 rue du barillet 60190 Hemevillers";
        
        await expect(geocodeAddress(address)).rejects.toThrowError();
    });

    it("should return an error because something goes wrong during the axios queries", async () => {
        axios.get.mockImplementation(() => Promise.reject(Error()));
        
        var address = "45 rue du barillet 60190 Hemevillers";
        
        await expect(geocodeAddress(address)).rejects.toThrowError();
    });
});

