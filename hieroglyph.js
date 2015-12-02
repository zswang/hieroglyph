(function(exportName) {
  /* global exports */
  var exports = exports || {};
  /**
   * @file hieroglyph
   * @see https://github.com/alcuadrado/hieroglyphy
   *
   * hieroglyph
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.0.2
   * @see https://github.com/zswang/jmd5s
   * @see https://github.com/wbond/md5-js
   * @date 2015-12-02
   */
  var _object_Object = '[]+{}'; // "[object Object]"
  var _NaN = '+{}+[]'; // "NaN"
  var _true = '!![]+[]'; // "true"
  var _false = '![]+[]'; // "false"
  var _undefined = '[][[]]+[]'; // "undefined"
  var numbers = [
    '+[]', // 0
    '+!![]', // 1
    '!![]+!![]', // 2
    '!![]+!![]+!![]', // 3
    '!![]+!![]+!![]+!![]', // 4
    '!![]+!![]+!![]+!![]+!![]', // 5
    '!![]+!![]+!![]+!![]+!![]+!![]', // 6
    '!![]+!![]+!![]+!![]+!![]+!![]+!![]', // 7
    '!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]', // 8
    '!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]' // 9
  ];
  var characters = {
    '0': numbers[0] + '+[]',
    '1': numbers[1] + '+[]',
    '2': numbers[2] + '+[]',
    '3': numbers[3] + '+[]',
    '4': numbers[4] + '+[]',
    '5': numbers[5] + '+[]',
    '6': numbers[6] + '+[]',
    '7': numbers[7] + '+[]',
    '8': numbers[8] + '+[]',
    '9': numbers[9] + '+[]'
  };
  characters[' '] = '(' + _object_Object + ')[' + numbers[7] + ']';
  characters['['] = '(' + _object_Object + ')[' + numbers[0] + ']';
  characters[']'] = '(' + _object_Object + ')[' + characters[1] + '+(' +
    characters[4] + ')]';
  characters['a'] = '(' + _NaN + ')[' + numbers[1] + ']';
  characters['b'] = '(' + _object_Object + ')[' + numbers[2] + ']';
  characters['c'] = '(' + _object_Object + ')[' + numbers[5] + ']';
  characters['d'] = '(' + _undefined + ')[' + numbers[2] + ']';
  characters['e'] = '(' + _undefined + ')[' + numbers[3] + ']';
  characters['f'] = '(' + _false + ')[' + numbers[0] + ']';
  characters['i'] = '(' + _undefined + ')[' + numbers[5] + ']';
  characters['j'] = '(' + _object_Object + ')[' + numbers[3] + ']';
  characters['l'] = '(' + _false + ')[' + numbers[2] + ']';
  characters['n'] = '(' + _undefined + ')[' + numbers[1] + ']';
  characters['o'] = '(' + _object_Object + ')[' + numbers[1] + ']';
  characters['r'] = '(' + _true + ')[' + numbers[1] + ']';
  characters['s'] = '(' + _false + ')[' + numbers[3] + ']';
  characters['t'] = '(' + _true + ')[' + numbers[0] + ']';
  characters['u'] = '(' + _undefined + ')[' + numbers[0] + ']';
  characters['N'] = '(' + _NaN + ')[' + numbers[0] + ']';
  characters['O'] = '(' + _object_Object + ')[' + numbers[8] + ']';
  characters['<'] = '([]+[])[' + encodeString('sub') + ']()[' + numbers[0] + ']';
  characters['>'] = '([]+[])[' + encodeString('sub') + ']()[' + numbers[4] + ']';
  characters['/'] = '([]+[])[' + encodeString('sub') + ']()[' + numbers[6] + ']';
  var _Infinity = '+(' + numbers[1] + '+' + characters['e'] + encodeNumber(1000) + ')+[]';
  characters['y'] = '(' + _Infinity + ')[' + numbers[7] + ']';
  characters['I'] = '(' + _Infinity + ')[' + numbers[0] + ']';
  var _1e100 = '+(' + numbers[1] + '+' + characters['e'] + encodeNumber(100) + ')+[]';
  characters['+'] = '(' + _1e100 + ')[' + numbers[2] + ']';
  var arrayConstructor = '[][' + encodeString('constructor') + ']';
  var _arrayConstructor = arrayConstructor + '+[]'; // "function Array() { [native code] }"
  var stringConstructor = '([]+[])[' + encodeString('constructor') + ']';
  var _stringConstructor = '([]+[])[' + encodeString('constructor') + ']+[]'; // "function String() { [native code] }"
  characters['A'] = '(' + _arrayConstructor + ')[' + numbers[9] + ']';
  characters['y'] = '(' + _arrayConstructor + ')[' + encodeNumber(13) + ']';
  characters['S'] = '(' + _stringConstructor + ')[' + numbers[9] + ']';
  characters['g'] = '(' + _stringConstructor + ')[' + characters[1] + '+(' + characters[4] + ')]';
  characters[','] = arrayConstructor + '(' + numbers[2] + ')' + '+[]';
  characters['p'] = '(' + encodeNumber(25) + ')[' + encodeString('toString') + '](' + encodeNumber(36) + ')';
  var functionConstructor = '([]+[])[' + encodeString('sub') + '][' +
    encodeString('constructor') + ']';
  var unescape = encodeScript('return unescape');
  var escape = encodeScript('return escape');
  characters['%'] = escape + '(' + encodeString('[') + ')[' + numbers[0] + ']';
  // console.log('escape: %j', escape);
  // Number.MAX_SAFE_INTEGER
  // "2gosa7pa2gv"
  // console.log('(' + numbers[0] + ')[' + encodeString('toString') + ']');
  /**
   * 混淆单个字符
   *
   * @param {string} char 单个字符
   * @return {string} 返回混淆后的内容
   '''<example>'''
   * @example encodeCharacter():base
    ```js
    var input = 'a';
    var output = hieroglyph.encodeCharacter(input);
    console.log(JSON.stringify(output));
    // > "(+{}+[])[+!![]]"
    console.log(eval(output));
    // > a
    ```
   * @example encodeCharacter():ascii
    ```js
    var count = 128;
    var success = 0;
    for (var i = 0; i < count; i++) {
      var char = String.fromCharCode(i);
      if (eval(hieroglyph.encodeCharacter(char)) === char) {
        success++;
      }
    }
    console.log(JSON.stringify(success));
    // > 128
    ```
   '''</example>'''
   */
  function encodeCharacter(char) {
    if (characters[char] !== undefined) {
      return characters[char];
    }
    var charCode = char.charCodeAt(0);
    if ((char === '\\') || (char === 'x')) {
      // These chars must be handled appart becuase the others need them
      characters[char] = getUnescapeSequence(charCode);
      return characters[char];
    }
    var shortestSequence = getUnicodeSequence(charCode);
    // ASCII characters can be obtained with hexa and unscape sequences
    if (charCode < 128) {
      var unescapeSequence = getUnescapeSequence(charCode);
      if (shortestSequence.length > unescapeSequence.length) {
        shortestSequence = unescapeSequence;
      }
      var hexaSequence = getHexaSequence(charCode);
      if (shortestSequence.length > hexaSequence.length) {
        shortestSequence = hexaSequence;
      }
    }
    characters[char] = shortestSequence;
    return shortestSequence;
  }
  exports.encodeCharacter = encodeCharacter;
  /**
   * 混淆字符串
   *
   * @param {string} str 字符串
   * @return {string} 返回混淆后的内容
   */
  function encodeString(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
      var char = str[i];
      result += (i > 0) ? '+' : '';
      if (i > 0 && /[\d,]/.test(char)) {
        result += '(' + encodeCharacter(char) + ')';
      } else {
        result += encodeCharacter(char);
      }
    }
    return result;
  }
  exports.encodeString = encodeString;
  /**
   * 混淆数值
   *
   * @param {string} n 数值
   * @return {string} 返回混淆后的内容
   '''<example>'''
   * @example encodeNumber():check 0~1000
    ```js
    var count = 1000;
    var success = 0;
    for (var i = 0; i < count; i++) {
      if (eval(hieroglyph.encodeNumber(i)) === i) {
        success++;
      }
    }
    console.log(success);
    // > 1000
    ```
   '''</example>'''
   */
  function encodeNumber(n) {
    n = +n;
    if (n <= 9) {
      return numbers[n];
    }
    return '+(' + encodeString(n.toString(10)) + ')';
  }
  exports.encodeNumber = encodeNumber;
  /**
   * 混淆函数
   *
   * @param {string} expr 表达式
   * @return {string} 返回混淆后的内容
   */
  function encodeScript(expr) {
    return functionConstructor + '(' + encodeString(expr) + ')()';
  }
  exports.encodeScript = encodeScript;
  function getHexaString(number, digits) {
    var string = number.toString(16);
    while (string.length < digits) {
      string = '0' + string;
    }
    return string;
  }
  function getUnescapeSequence(charCode) {
    return unescape + '(' +
      encodeString('%' + getHexaString(charCode, 2)) + ')';
  }
  function getHexaSequence(charCode) {
    return encodeString('\\x' + getHexaString(charCode, 2));
  }
  function getUnicodeSequence(charCode) {
    return encodeString('\\u' + getHexaString(charCode, 4));
  }
  // Object.keys(characters).forEach(function (char) {
  //   console.log(char);
  //   if (eval(characters[char]) !== char) {
  //     console.log('>>>>', eval(characters[char]), char, characters[char]);
  //   }
  // });
  if (typeof define === 'function') {
    if (define.amd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
})('hieroglyph');
// ;(function (global, undefined) {
// /*jshint sub:true, evil:true */
//     'use strict";
//     var numbers,
//         _object_Object,
//         _NaN,
//         _true,
//         _false,
//         _undefined,
//         _Infinity,
//         _1e100,
//         characters,
//         functionConstructor,
//         escape,
//         unescape,
//         locationString,
//         API;
//     _object_Object = "[]+{}";
//     _NaN = "+{}+[]";
//     _true = "!![]+[]";
//     _false = "![]+[]";
//     _undefined = "[][[]]+[]";
//     characters[" "] = "(" + _object_Object + ")[" + numbers[7]  + "]";
//     characters["["] = "(" + _object_Object + ")[" + numbers[0]  + "]";
//     characters["]"] = "(" + _object_Object + ")[" + characters[1] + "+" +
//         characters[4] + "]";
//     characters["a"] = "(" + _NaN + ")[" + numbers[1] + "]";
//     characters["b"] = "(" + _object_Object + ")[" + numbers[2] + "]";
//     characters["c"] = "(" + _object_Object + ")[" + numbers[5] + "]";
//     characters["d"] = "(" + _undefined + ")[" + numbers[2] + "]";
//     characters["e"] = "(" + _undefined + ")[" + numbers[3] + "]";
//     characters["f"] = "(" + _false + ")[" + numbers[0] + "]";
//     characters["i"] = "(" + _undefined + ")[" + numbers[5] + "]";
//     characters["j"] = "(" + _object_Object + ")[" + numbers[3] + "]";
//     characters["l"] = "(" + _false + ")[" + numbers[2] + "]";
//     characters["n"] = "(" + _undefined + ")[" + numbers[1] + "]";
//     characters["o"] = "(" + _object_Object + ")[" + numbers[1] + "]";
//     characters["r"] = "(" + _true + ")[" + numbers[1] + "]";
//     characters["s"] = "(" + _false + ")[" + numbers[3] + "]";
//     characters["t"] = "(" + _true + ")[" + numbers[0] + "]";
//     characters["u"] = "(" + _undefined + ")[" + numbers[0] +"]";
//     characters["N"] = "(" + _NaN + ")[" + numbers[0] + "]";
//     characters["O"] = "(" + _object_Object + ")[" + numbers[8] + "]";
//     _Infinity = "+(" + numbers[1] + "+" + characters["e"] + "+" +
//         characters[1] + "+" + characters[0] + "+" + characters[0] + "+" +
//         characters[0] + ")+[]";
//     characters["y"] = "(" + _Infinity + ")[" + numbers[7] + "]";
//     characters["I"] = "(" + _Infinity + ")[" + numbers[0] + "]";
//     _1e100 = "+(" + numbers[1] + "+" + characters["e"] + "+" +
//         characters[1] + "+" + characters[0] + "+" + characters[0] + ")+[]";
//     characters["+"] = "(" + _1e100 + ")[" + numbers[2] + "]";
//     functionConstructor = "[][" + hieroglyphyString("sort") + "][" +
//         hieroglyphyString("constructor") + "]";
//     //Below characters need target http(s) pages
//     locationString = "[]+" + hieroglyphyScript("return location");
//     characters["h"] = "(" + locationString + ")" + "[" + numbers[0] + "]";
//     characters["p"] = "(" + locationString + ")" + "[" + numbers[3] + "]";
//     characters["/"] = "(" + locationString + ")" + "[" + numbers[6] + "]";
//     unescape = hieroglyphyScript("return unescape");
//     escape = hieroglyphyScript("return escape");
//     characters["%"] = escape + "(" + hieroglyphyString("[") + ")[" +
//         numbers[0] + "]";
//     function getHexaString (number, digits) {
//         var string = number.toString(16);
//         while (string.length < digits) {
//             string = "0" + string;
//         }
//         return string;
//     }
//     function getUnescapeSequence (charCode) {
//         return unescape + "(" +
//             hieroglyphyString("%" + getHexaString(charCode, 2)) + ")";
//     }
//     function getHexaSequence (charCode) {
//         return hieroglyphyString("\\x" + getHexaString(charCode, 2));
//     }
//     function getUnicodeSequence (charCode) {
//         return hieroglyphyString("\\u" + getHexaString(charCode, 4));
//     }
//     function hieroglyphyCharacter (char) {
//         var charCode = char.charCodeAt(0),
//             unescapeSequence,
//             hexaSequence,
//             unicodeSequence,
//             shortestSequence;
//         if (characters[char] !== undefined) {
//             return characters[char];
//         }
//         if ((char === "\\") || (char == "x")) {
//             //These chars must be handled appart becuase the others need them
//             characters[char] = getUnescapeSequence(charCode);
//             return characters[char];
//         }
//         shortestSequence = getUnicodeSequence(charCode);
//         //ASCII characters can be obtained with hexa and unscape sequences
//         if (charCode < 128) {
//             unescapeSequence = getUnescapeSequence(charCode);
//             if (shortestSequence.length > unescapeSequence.length) {
//                 shortestSequence = unescapeSequence;
//             }
//             hexaSequence = getHexaSequence(charCode);
//             if (shortestSequence.length > hexaSequence.length) {
//                 shortestSequence = hexaSequence;
//             }
//         }
//         characters[char] = shortestSequence;
//         return shortestSequence;
//     }
//     function hieroglyphyString (str) {
//         var i,
//             hieroglyphiedStr = "";
//         for (i = 0; i < str.length; i += 1) {
//             hieroglyphiedStr += (i > 0) ? "+" : "";
//             hieroglyphiedStr += hieroglyphyCharacter(str[i]);
//         }
//         return hieroglyphiedStr;
//     }
//     function hieroglyphyNumber (n) {
//         n = +n;
//         if (n <= 9) {
//             return numbers[n];
//         }
//         return "+(" + hieroglyphyString(n.toString(10)) + ")";
//     }
//     function hieroglyphyScript (src) {
//         return functionConstructor + "("  + hieroglyphyString(src) + ")()";
//     }
//     API = {
//         hieroglyphyString: hieroglyphyString,
//         hieroglyphyNumber: hieroglyphyNumber,
//         hieroglyphyScript: hieroglyphyScript
//     };
//     if (global.define && global.define.amd) {
//         global.define([], API);
//     } else if (typeof exports !== "undefined") {
//         module.exports = API;
//     } else {
//         global.hieroglyphy = API;
//     }
// })(this);