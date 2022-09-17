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
exports.stringifyPrivateJWK = exports.stringifyPublicJWK = exports.pkcs8ToJwk = exports.spkiToJwk = exports.jwk2spki = exports.jwk2pkcs1 = exports.jwk2pkcs8 = void 0;
var asn1_packer_1 = require("../utils/asn1-packer");
var asn1_parser_1 = require("../utils/asn1-parser");
var binary_utils_1 = require("../utils/binary-utils");
var jwk2pkcs8 = function (jwk) {
    return (0, asn1_packer_1.pack)([
        0x30,
        [
            [0x02, '00'],
            [0x30, [[0x06, '2a864886f70d010101'], [0x05]]],
            [
                0x04,
                [
                    [
                        0x30,
                        [
                            [0x02, '00'],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.n))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.e))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.d))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.p))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.q))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.dp))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.dq))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.qi))],
                        ],
                    ],
                ],
            ],
        ],
    ]);
};
exports.jwk2pkcs8 = jwk2pkcs8;
var jwk2pkcs1 = function (jwk) {
    return (0, asn1_packer_1.pack)([
        0x30,
        [
            [0x02, '00'],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.n))],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.e))],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.d))],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.p))],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.q))],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.dp))],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.dq))],
            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.qi))],
        ],
    ]);
};
exports.jwk2pkcs1 = jwk2pkcs1;
var jwk2spki = function (jwk) {
    return (0, asn1_packer_1.pack)([
        0x30,
        [
            [0x30, [[0x06, '2a864886f70d010101'], [0x05]]],
            [
                0x03,
                [
                    [
                        0x30,
                        [
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.n))],
                            [0x02, (0, binary_utils_1.ua2hex)((0, binary_utils_1.b64Url2ua)(jwk.e))],
                        ],
                    ],
                ],
            ],
        ],
    ]);
};
exports.jwk2spki = jwk2spki;
var spkiToJwk = function (buf) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    var asn1 = (0, asn1_parser_1.parseAsn1)(new Uint8Array(buf));
    var modulus = undefined;
    var exponent = undefined;
    if (asn1.type === 0x30 &&
        ((_b = (_a = asn1.children) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type) === 0x30 &&
        ((_f = (_e = (_d = (_c = asn1.children) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.children) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.type) === 0x06 &&
        (0, binary_utils_1.ua2hex)((_l = (_k = (_j = (_h = (_g = asn1.children) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.children) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.value) !== null && _l !== void 0 ? _l : new Uint8Array()) === '2a864886f70d010101') {
        modulus = (_s = (_r = (_q = (_p = (_o = (_m = asn1.children) === null || _m === void 0 ? void 0 : _m[1]) === null || _o === void 0 ? void 0 : _o.children) === null || _p === void 0 ? void 0 : _p[0]) === null || _q === void 0 ? void 0 : _q.children) === null || _r === void 0 ? void 0 : _r[0]) === null || _s === void 0 ? void 0 : _s.value;
        exponent = (_y = (_x = (_w = (_v = (_u = (_t = asn1.children) === null || _t === void 0 ? void 0 : _t[1]) === null || _u === void 0 ? void 0 : _u.children) === null || _v === void 0 ? void 0 : _v[0]) === null || _w === void 0 ? void 0 : _w.children) === null || _x === void 0 ? void 0 : _x[1]) === null || _y === void 0 ? void 0 : _y.value;
    }
    else if (asn1.type === 0x30 && ((_0 = (_z = asn1.children) === null || _z === void 0 ? void 0 : _z[0]) === null || _0 === void 0 ? void 0 : _0.type) === 0x02 && ((_2 = (_1 = asn1.children) === null || _1 === void 0 ? void 0 : _1[1]) === null || _2 === void 0 ? void 0 : _2.type) === 0x02) {
        modulus = (_4 = (_3 = asn1.children) === null || _3 === void 0 ? void 0 : _3[0]) === null || _4 === void 0 ? void 0 : _4.value;
        exponent = (_6 = (_5 = asn1.children) === null || _5 === void 0 ? void 0 : _5[1]) === null || _6 === void 0 ? void 0 : _6.value;
    }
    if (!modulus || !exponent) {
        throw new Error('Invalid spki format');
    }
    return {
        kty: 'RSA',
        alg: 'RSA-OAEP',
        ext: true,
        n: (0, binary_utils_1.ua2b64Url)(minimalRep(modulus)),
        e: (0, binary_utils_1.ua2b64Url)(minimalRep(exponent)),
    };
};
exports.spkiToJwk = spkiToJwk;
var pkcs8ToJwk = function (buf) {
    var _a, _b;
    var parsed = (0, asn1_parser_1.parseAsn1)(new Uint8Array(buf));
    var seq = ((_a = parsed.children) === null || _a === void 0 ? void 0 : _a.length) === 3 && parsed.children[2].type === 0x04 && ((_b = parsed.children[2].children) === null || _b === void 0 ? void 0 : _b.length) === 1
        ? parsed.children[2].children[0]
        : parsed;
    return {
        kty: 'RSA',
        n: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[1].value)),
        e: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[2].value)),
        d: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[3].value)),
        p: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[4].value)),
        q: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[5].value)),
        dp: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[6].value)),
        dq: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[7].value)),
        qi: (0, binary_utils_1.ua2b64Url)(minimalRep(seq.children[8].value)),
    };
};
exports.pkcs8ToJwk = pkcs8ToJwk;
var stringifyPublicJWK = function (jwk) {
    return (0, binary_utils_1.ua2b64)((0, binary_utils_1.hex2ua)((0, exports.jwk2spki)(jwk)));
};
exports.stringifyPublicJWK = stringifyPublicJWK;
var stringifyPrivateJWK = function (jwk) {
    return (0, binary_utils_1.ua2b64)((0, binary_utils_1.hex2ua)((0, exports.jwk2pkcs1)(jwk)));
};
exports.stringifyPrivateJWK = stringifyPrivateJWK;
var minimalRep = function (b) {
    var i = 0;
    while (b[i] === 0) {
        i++;
    }
    return b.slice(i);
};
