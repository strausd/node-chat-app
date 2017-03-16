var expect = require("expect");

var {generateMessage, generateLocationMessage} = require("./message");

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        var from = 'Danny';
        var text = 'Some message';
        var message = generateMessage(from, text);
        
        expect(message.from).toBe(from);
        expect(message.text).toBe(text);
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'Danny';
        var latitude = 30;
        var longitude = 15;
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var message = generateLocationMessage(from, latitude, longitude);
        
        expect(message.from).toBe(from);
        expect(message.url).toBe(url);
        expect(message.createdAt).toBeA('number');
    });
});