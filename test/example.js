var assert = require('should');
var hieroglyph = require('../.');
var util = require('util');
var printValue;
function print(value) {
  if (typeof printValue !== 'undefined') {
    throw new Error('Test case does not match.');
  }
  printValue = value;
}
describe("./src/hieroglyph.js", function () {
  printValue = undefined;
  it("encodeCharacter():base", function () {
    var input = 'a';
    var output = hieroglyph.encodeCharacter(input);
    print(JSON.stringify(output));
    assert.equal(printValue, "\"(+{}+[])[+!![]]\""); printValue = undefined;
    print(eval(output));
    assert.equal(printValue, "a"); printValue = undefined;
  });
  it("encodeCharacter():ascii", function () {
    var count = 128;
    var success = 0;
    for (var i = 0; i < count; i++) {
      var char = String.fromCharCode(i);
      if (eval(hieroglyph.encodeCharacter(char)) === char) {
        success++;
      }
    }
    print(JSON.stringify(success));
    assert.equal(printValue, "128"); printValue = undefined;
  });
  it("encodeNumber():check 0~1000", function () {
    var count = 1000;
    var success = 0;
    for (var i = 0; i < count; i++) {
      if (eval(hieroglyph.encodeNumber(i)) === i) {
        success++;
      }
    }
    print(success);
    assert.equal(printValue, "1000"); printValue = undefined;
  });
});
