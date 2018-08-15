var expect = require("expect");

var {generateMessage, generateLocationMessage, styleMessage} = require("../utils/message");

describe("generateMessage", () => {
    it("should generate a correct message", () => {
        var from = "Admin";
        var text = "Test message";
        var result = generateMessage(from, text);
        
        expect(result.from).toBe(from);
        expect(result.text).toBe(text);
        //Same as 
        expect(result).toMatchObject({from, text});
        
        expect(typeof result.createdAt).toBe("number");

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
        expect(result).toMatchObject({from, url});
        
        expect(typeof result.createdAt).toBe("number");

    });
});

describe("styleMessage", () => {
    it("should style the message in function of the type", () => {
        let normalMessage = {
            type: "MESSAGE",
            text: "Hello World!"
        };
        let errorMessage = {
            text: "Hello World!",
            type: "ERROR"
        };
        let helpMessage = {
            text: "Hello World!",
            type: "HELP"
        };

        expect(styleMessage(normalMessage.text)).toBe("Hello World!");

        expect(styleMessage(normalMessage.text, normalMessage.type)).toBe("Hello World!");

        expect(styleMessage(errorMessage.text, errorMessage.type))
            .toBe(`<span class="error-message">${errorMessage.text}</span>`);

        expect(styleMessage(helpMessage.text, helpMessage.type))
            .toBe(`<span class="help-message">${helpMessage.text}</span>`);
    });
});