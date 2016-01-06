global.btoa = function (str) {
  return new Buffer(String(str)).toString('base64');
};
global.atob = function (base64) {
  return new Buffer(String(base64), 'base64').toString();
};
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
global.print = print;
describe("./src/hieroglyph.js", function () {
  printValue = undefined;
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
      var result = eval(hieroglyph.encodeCharacter(char));
      if (result.length > 1) {
        result = eval('"' + result + '"');
      }
      if (result === char) {
        success++;
      }
    }
    print(JSON.stringify(success));
    assert.equal(printValue, "128"); printValue = undefined;
  });
  it("encodeCharacter():unicode", function () {
    var result = eval(hieroglyph.encodeCharacter('汉'));
    if (result.length > 1) {
      result = eval('"' + result + '"');
    }
    print(JSON.stringify(result));
    assert.equal(printValue, "\"汉\""); printValue = undefined;
  });
  it("encodeScript():base", function () {
    var script = hieroglyph.encodeScript('print("hello world!你好")');
    eval(script);
    assert.equal(printValue, "hello world!你好"); printValue = undefined;
  });
});
