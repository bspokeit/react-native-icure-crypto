"use strict";
/*
 * Copyright 2018 Taktik sa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ua2hex = exports.hex2ua = exports.b64Url2ua = exports.ua2b64Url = exports.ua2b64 = exports.b642ua = exports.b642ab = exports.ua2ab = exports.a2b = exports.b2a = exports.string2ab = exports.string2ua = exports.ua2string = void 0;
var base_64_1 = require("base-64");
var ua2string = function (_ua) {
    var str = "";
    var ab = new Uint8Array(_ua);
    var abLen = ab.length;
    var CHUNK_SIZE = Math.pow(2, 8);
    var offset, len, subab;
    for (offset = 0; offset < abLen; offset += CHUNK_SIZE) {
        len = Math.min(CHUNK_SIZE, abLen - offset);
        subab = ab.subarray(offset, offset + len);
        str += String.fromCharCode.apply(null, subab);
    }
    return str;
};
exports.ua2string = ua2string;
var string2ua = function (s) {
    var ua = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) {
        ua[i] = s.charCodeAt(i) & 0xff;
    }
    return ua;
};
exports.string2ua = string2ua;
var string2ab = function (s) {
    return (0, exports.ua2ab)((0, exports.string2ua)(s));
};
exports.string2ab = string2ab;
var b2a = function (a) {
    return (0, base_64_1.encode)(a);
};
exports.b2a = b2a;
var a2b = function (s) {
    return (0, base_64_1.decode)(s);
};
exports.a2b = a2b;
var ua2ab = function (ua) {
    var buffer = ua.buffer;
    return (buffer.byteLength > ua.byteLength ? buffer.slice(0, ua.byteLength) : buffer);
};
exports.ua2ab = ua2ab;
var b642ab = function (s) {
    return (0, exports.ua2ab)((0, exports.string2ua)((0, exports.a2b)(s)));
};
exports.b642ab = b642ab;
var b642ua = function (s) {
    return (0, exports.string2ua)((0, exports.a2b)(s));
};
exports.b642ua = b642ua;
var ua2b64 = function (_ua) {
    return (0, exports.b2a)((0, exports.ua2string)(_ua));
};
exports.ua2b64 = ua2b64;
var ua2b64Url = function (_ua) {
    return (0, exports.b2a)((0, exports.ua2string)(_ua))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};
exports.ua2b64Url = ua2b64Url;
var b64Url2ua = function (ua) {
    return (0, exports.b642ua)(ua.replace(/-/g, "+").replace(/_/g, "/").replace(/=/g, "") +
        (ua.length % 4 === 3 ? "=" : ua.length % 4 === 2 ? "==" : ""));
};
exports.b64Url2ua = b64Url2ua;
var hex2ua = function (s) {
    var ua = new Uint8Array(s.length / 2);
    s = s.toLowerCase();
    for (var i = 0; i < s.length; i += 2) {
        ua[i / 2] =
            (s.charCodeAt(i) < 58 ? s.charCodeAt(i) - 48 : s.charCodeAt(i) - 87) *
                16 +
                (s.charCodeAt(i + 1) < 58
                    ? s.charCodeAt(i + 1) - 48
                    : s.charCodeAt(i + 1) - 87);
    }
    return ua;
};
exports.hex2ua = hex2ua;
/**
 * Uint8Array/ArrayBuffer to hex String
 *
 * @param _ua {Uint8Array} or ArrayBuffer
 * @returns {String} Hex String
 */
var ua2hex = function (_ua) {
    var s = "";
    var ua = new Uint8Array(_ua);
    for (var i = 0; i < ua.length; i++) {
        var hhb = (ua[i] & 0xf0) >> 4;
        var lhb = ua[i] & 0x0f;
        s += String.fromCharCode(hhb > 9 ? hhb + 87 : hhb + 48);
        s += String.fromCharCode(lhb > 9 ? lhb + 87 : lhb + 48);
    }
    return s;
};
exports.ua2hex = ua2hex;
