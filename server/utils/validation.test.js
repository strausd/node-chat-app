const expect = require("expect");
const {isRealString} = require("./validation.js");

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var str = 4 + 5;
        expect(isRealString(str)).toBe(false);
    });
    it('should reject strings with only spaces', () => {
        var str = '           ';
        expect(isRealString(str)).toBe(false);
    });
    it('should allow string with non-space characters', () => {
        var str = '      this is working     ';
        expect(isRealString(str)).toBe(true);
    });
});