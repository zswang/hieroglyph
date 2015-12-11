(function (exportName) {

  /*<remove>*/
  'use strict';
  /* global exports */
  /* jshint -W069 */
  /*</remove>*/

  var exports = {};

  /*<jdists encoding="ejs" data="../package.json">*/
  /**
   * @file <%- name %>
   * @see https://github.com/alcuadrado/hieroglyphy
   *
   * <%- description %>
   * @author
       <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
   *   <%- item.name %> (<%- item.url %>)
       <% }); %>
   * @version <%- version %>
       <% var now = new Date() %>
   * @see https://github.com/zswang/jmd5s
   * @see https://github.com/wbond/md5-js
   * @date <%- [
        now.getFullYear(),
        now.getMonth() + 101,
        now.getDate() + 100
      ].join('-').replace(/-1/g, '-') %>
   */
  /*</jdists>*/

  /*<remove>*/
  global.btoa = function (str) {
    return new Buffer(String(str)).toString('base64');
  };
  global.atob = function (base64) {
    return new Buffer(String(base64), 'base64').toString();
  };
  /*</remove>*/

  var numbers = [
    '+[]', // 0
    '+!![]', // 1
    '!![]+!![]', // 2
    '!![]+!![]+!![]', // 3
    '!![]+!![]+!![]+!![]', // 4
    '!![]+!![]+!![]+!![]+!![]', // 5
    '!![]+!![]+!![]+!![]+!![]+!![]', // 6
    '!![]+!![]+!![]+!![]+!![]+!![]+!![]', // 7
    // '!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]', // 8
    '+(+[]+([]+{})[+!![]]+(+!![])+(+[]))', // 8 "+(0o10)"
    // '!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]', // 9
    '+(+[]+([]+{})[+!![]]+(+!![])+(+!![]))', // 9 "+(0o11)"
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
    '9': numbers[9] + '+[]',
  };

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
    if (n >= 0 && n <= 9) {
      return numbers[n];
    }
    return '+(' + encodeString(n.toString(10)) + ')';
  }
  exports.encodeNumber = encodeNumber;

  var _object_Object = '[]+{}'; // "[object Object]" -5-
  characters['['] = '(' + _object_Object + ')[' + numbers[0] + ']';
  characters['o'] = '(' + _object_Object + ')[' + numbers[1] + ']';
  characters['b'] = '(' + _object_Object + ')[' + numbers[2] + ']';
  characters['j'] = '(' + _object_Object + ')[' + numbers[3] + ']';
  characters['e'] = '(' + _object_Object + ')[' + numbers[4] + ']';
  characters['c'] = '(' + _object_Object + ')[' + numbers[5] + ']';
  characters['t'] = '(' + _object_Object + ')[' + numbers[6] + ']';
  characters[' '] = '(' + _object_Object + ')[' + numbers[7] + ']';
  characters['O'] = '(' + _object_Object + ')[' + numbers[8] + ']';
  characters[']'] = '(' + _object_Object + ')[' + encodeNumber(14) + ']';

  var _false = '![]+[]'; // "false" -6-
  characters['f'] = '(' + _false + ')[' + numbers[0] + ']';
  characters['l'] = '(' + _false + ')[' + numbers[2] + ']';
  characters['s'] = '(' + _false + ')[' + numbers[3] + ']';

  var _NaN = '+{}+[]'; // "NaN" -6-
  characters['a'] = '(' + _NaN + ')[' + numbers[1] + ']';
  characters['N'] = '(' + _NaN + ')[' + numbers[0] + ']';

  var _true = '!![]+[]'; // "true" -6-
  characters['r'] = '(' + _true + ')[' + numbers[1] + ']';

  var _undefined = '[][[]]+[]'; // "undefined" -9-
  characters['u'] = '(' + _undefined + ')[' + numbers[0] + ']';
  characters['n'] = '(' + _undefined + ')[' + numbers[1] + ']';
  characters['d'] = '(' + _undefined + ')[' + numbers[2] + ']';
  characters['i'] = '(' + _undefined + ')[' + numbers[5] + ']';

  var _sub = '([]+[])[' + encodeString('sub') + ']()'; // <sub></sub>
  characters['<'] = _sub + '[' + numbers[0] + ']';
  characters['>'] = _sub + '[' + numbers[4] + ']';
  characters['/'] = _sub + '[' + numbers[6] + ']';

  var _Infinity = '+(' + numbers[1] + '+' + characters['e'] + encodeNumber(1000) + ')+[]';
  characters['y'] = '(' + _Infinity + ')[' + numbers[7] + ']';
  characters['I'] = '(' + _Infinity + ')[' + numbers[0] + ']';

  var _1e100 = '+(' + numbers[1] + '+' + characters['e'] + '+(' + encodeNumber(100) + '))+[]'; // "1e+100"
  characters['+'] = '(' + _1e100 + ')[' + numbers[2] + ']';

  var $arrayConstructor = '[][' + encodeString('constructor') + ']';
  characters[','] = '(' + $arrayConstructor + '(' + numbers[2] + ')' + '+[])';

  var $functionConstructor = '([]+[])[' + encodeString('sub') + '][' +
    encodeString('constructor') + ']';

  characters['.'] = '(+(' + encodeString('11e111') + ')+[])[' + numbers[1] + ']';

  // (+'11e111'+[])[1]
  // (+'0.0000001'+[])[2]
  characters['-'] = '(+(' + encodeString('0.0000001') + ')+[])[' + numbers[2] + ']';

  // Oj9O
  characters['?'] = $functionConstructor + '(' +
    encodeString('return atob') + ')()(' + encodeString('Oj9O') + ')[' + numbers[1] + ']';

  // OtOO
  characters[':'] = $functionConstructor + '(' +
    encodeString('return atob') + ')()(' + encodeString('OtOO') + ')[' + numbers[0] + ']';

  var _subFunction = '([]+[])[' + encodeString('sub') + ']+[]'; // function sub(){ [native code] }
  characters['('] = '(' + _subFunction + ')[' + encodeNumber(12) + ']'; // 'function sub() {'
  characters[')'] = '(' + _subFunction + ')[' + encodeNumber(13) + ']'; // 'function sub() {'
  characters['{'] = '(' + _subFunction + ')[' + encodeNumber(15) + ']'; // 'function sub() {'
  characters['}'] = '(' + _subFunction + ')[' + encodeString('slice') + '](' + encodeNumber(-1) + ')'; // 'function sub() {'

  var _fontcolor = '([]+[])[' + encodeString('fontcolor') + ']()'; // "<font color="undefined"></font>"
  characters['='] = _fontcolor + '[' + encodeNumber(11) + ']';
  characters['"'] = _fontcolor + '[' + encodeNumber(12) + ']';

  var _fontcolorQuot = '([]+[])[' + encodeString('fontcolor') + '](' +
    characters['"'] + ')'; // "<font color="&quot;"></font>"
  characters['&'] = _fontcolorQuot + '[' + encodeNumber(13) + ']';
  characters['q'] = _fontcolorQuot + '[' + encodeNumber(14) + ']';
  characters[';'] = _fontcolorQuot + '[' + encodeNumber(18) + ']';

  var stringConstructor = '([]+[])[' + encodeString('constructor') + ']';
  var _stringConstructor = stringConstructor + '+[]'; // "function String() { [native code] }"
  characters['S'] = '(' + _stringConstructor + ')[' + numbers[9] + ']';
  characters['g'] = '(' + _stringConstructor + ')[' + encodeNumber(14) + ']';

  var _arrayConstructor = $arrayConstructor + '+[]'; // "function Array() { [native code] }"
  characters['A'] = '(' + _arrayConstructor + ')[' + numbers[9] + ']';

  // btoa("]t]") => XXRd
  characters['R'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + encodeString(']t]') + ')[' + numbers[2] + ']';

  characters['E'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + encodeString('11') + ')[' + numbers[2] + ']';
  characters['Q'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + numbers[1] + ')[' + numbers[1] + ']';

  characters['\\'] = $functionConstructor + '(' +
    encodeString('return atob') + ')()(' + encodeString('eitc') + ')[' + numbers[2] + ']';

  characters['M'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + encodeString(']c ') + ')[' + numbers[2] + ']';

  characters['C'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + encodeString('0 ') + ')[' + numbers[1] + ']';

  characters['x'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + encodeString(']l]') + ')[' + numbers[2] + ']';

  // "0j[" -> 41 -> "MGpb"
  characters['p'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + encodeString('oj[') + ')[' + numbers[2] + ']';

  // "]8]" -> "XThd"
  characters['h'] = $functionConstructor + '(' +
    encodeString('return btoa') + ')()(' + encodeString(']8]') + ')[' + numbers[2] + ']';

  var numberConstructor = '(+[])[' + encodeString('constructor') + ']';
  var _numberConstructor = numberConstructor + '+[]';
  characters['N'] = '(' + _numberConstructor + ')[' + numbers[9] + ']';
  characters['m'] = '(' + _numberConstructor + ')[' + encodeNumber(11) + ']';

  var booleanConstructor = '(![])[' + encodeString('constructor') + ']';
  var _booleanConstructor = booleanConstructor + '+[]';
  characters['B'] = '(' + _booleanConstructor + ')[' + numbers[9] + ']';

  // atob('OO8l')[2] => %
  characters['%'] = $functionConstructor + '(' +
    encodeString('return atob') + ')()(' + encodeString('OO8l') + ')[' + numbers[2] + ']';

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
      var result = eval(hieroglyph.encodeCharacter(char));
      if (result.length > 1) {
        result = eval(result);
      }
      if (result === char) {
        success++;
      }
    }
    console.log(JSON.stringify(success));
    // > 128
    ```
   * @example encodeCharacter():unicode
    ```js
    var result = eval(hieroglyph.encodeCharacter('汉'));
    if (result.length > 1) {
      result = eval(result);
    }
    console.log(JSON.stringify(result));
    // > "汉"
    ```
   '''</example>'''
   */
  function encodeCharacter(char) {
    if (characters[char] !== undefined) {
      return characters[char];
    }
    var charCode = char.charCodeAt();
    characters[char] =
      encodeString('"\\u' + (charCode + 0x10000).toString(16).slice(1) + '"');
    return characters[char];
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
      if (i > 0 && /\d/.test(char)) {
        result += '(' + encodeCharacter(char) + ')';
      }
      else {
        result += encodeCharacter(char);
      }
    }
    return result;
  }
  exports.encodeString = encodeString;

  /**
   * 混淆函数
   *
   * @param {string} expr 表达式
   * @return {string} 返回混淆后的内容
   */
  function encodeScript(expr) {
    return $functionConstructor + '(' + encodeString(expr) + ')()';
  }
  exports.encodeScript = encodeScript;

  /*<debug>*/
  Object.keys(characters).forEach(function (char) {
    if (eval(characters[char]) !== char) {
      console.log("char: %j", char);
      console.log('>>>>', eval(characters[char]), char, characters[char]);
    }
  });

  console.log(Object.keys(characters).map(function (key) {
    return [key, characters[key].length];
  }).sort(function (a, b) {
    return a[1] - b[1];
  }));

  // console.log(JSON.stringify(characters, null, '  '))
  // console.log(characters['p'].length);

  // console.log("%j", eval(encodeCharacter('M')));
  // console.log("%j", eval(encodeString('ab')));
  // console.log(encodeString('ab').length);

  // console.log("%j", eval(encodeString('汉')));
  // console.log(encodeString('汉').length);

  // console.log("%j", eval(encodeString('\u6c49')));
  // console.log("%j", encodeScript("console.log('hello world!')").length);
  // eval(encodeScript("console.log('hello world!')"));
  /*</debug>*/

  if (typeof define === 'function') {
    if (define.amd) {
      define(function () {
        return exports;
      });
    }
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }
  else {
    window[exportName] = exports;
  }

})('hieroglyph');