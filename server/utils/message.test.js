var expect = require("expect");

var {generateMessage} = require("./message");

describe("generateMessage", () => {
    it("should generate a correct message", (done) => {
        var from = "Admin";
        var text = "Test message";
        var result = generateMessage(from, text);
        
        expect(result.from).toBe(from);
        expect(result.text).toBe(text);
        //Same as 
        expect(result).toInclude({from, text});
        
        expect(result.createdAt).toBeA("number");

        done();
    });
});