var expect = require("expect");

var {generateMessage, generateLocationMessage} = require("./message");

describe("generateMessage", () => {
    it("should generate a correct message", () => {
        var from = "Admin";
        var text = "Test message";
        var result = generateMessage(from, text);
        
        expect(result.from).toBe(from);
        expect(result.text).toBe(text);
        //Same as 
        expect(result).toInclude({from, text});
        
        expect(result.createdAt).toBeA("number");

    });
});

describe("generateLocationMessage", () => {
    it("should generate a correct message", () => {
        var from = "Admin";
        var latitude = "49.463885";
        var longitude = "2.670449";
        var url = `https://www.google.com/maps?=${latitude},${longitude}`;
        var result = generateLocationMessage(from, latitude, longitude);
        
        expect(result.from).toBe(from);
        expect(result.url).toBe(url);
        //Same as 
        expect(result).toInclude({from, url});
        
        expect(result.createdAt).toBeA("number");

    });
});