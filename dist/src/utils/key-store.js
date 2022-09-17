"use strict";
/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoKeyStore = void 0;
var binary_utils_1 = require("./binary-utils");
var AES_KEY_DATA_KEYS = ["k"];
var RSA_OAEP_KEY_DATA_KEYS = ["n", "e", "d", "q", "p", "dq", "dp", "qi"];
var abs2kd = function (abs, keys) {
    return keys.reduce(function (acc, key, index) {
        acc[key] = abs[index];
        return acc;
    }, {});
};
var jwk2kd = function (jwk, keys) {
    return keys.reduce(function (acc, key) {
        if (jwk[key]) {
            acc[key] = (0, binary_utils_1.b64Url2ua)(jwk[key]);
        }
        return acc;
    }, {});
};
var kd2jwk = function (keyData, defaultJwk) {
    return Object.keys(keyData).reduce(function (acc, key) {
        if (keyData[key]) {
            acc[key] = (0, binary_utils_1.ua2b64Url)(keyData[key]);
        }
        return acc;
    }, defaultJwk);
};
var AESCBCUtils = {
    jwk2raw: function (jwk) {
        return jwk2kd(jwk, AES_KEY_DATA_KEYS);
    },
    raw2jwk: function (cryptoKey, keyData) {
        return kd2jwk(keyData, {
            kty: "oct",
            key_ops: cryptoKey.usages,
            alg: "A256CBC",
            ext: cryptoKey.extractable,
        });
    },
};
var RSAOAEPUtils = {
    jwk2raw: function (jwk) {
        return jwk2kd(jwk, RSA_OAEP_KEY_DATA_KEYS);
    },
    raw2jwk: function (cryptoKey, keyData) {
        return kd2jwk(keyData, {
            kty: "RSA",
            key_ops: cryptoKey.usages,
            alg: "RSA-OAEP",
            ext: cryptoKey.extractable,
        });
    },
};
var CryptoKeyStore = /** @class */ (function () {
    function CryptoKeyStore() {
        var _this = this;
        this.addCryptoKeyData = function (cryptoKey, keyData) {
            _this.keys.push({
                cryptoKey: cryptoKey,
                keyData: keyData,
            });
        };
        this.getCryptoKeyData = function (cryptoKey) {
            for (var i = 0; i < _this.keys.length; i += 1) {
                if (_this.keys[i].cryptoKey === cryptoKey) {
                    return _this.keys[i].keyData;
                }
            }
        };
        this.removeCryptoKeyData = function (cryptoKey) {
            for (var i = 0; i < _this.keys.length; i += 1) {
                if (_this.keys[i].cryptoKey === cryptoKey) {
                    _this.keys = _this.keys.splice(i, 1);
                    return;
                }
            }
        };
        this.exportKey = function (format, cryptoKey) {
            /*
                Validate Key algorithm
            */
            var _a, _b;
            if (!!((_a = cryptoKey === null || cryptoKey === void 0 ? void 0 : cryptoKey.algorithm) === null || _a === void 0 ? void 0 : _a.name) &&
                cryptoKey.algorithm.name !== "RSA-OAEP" &&
                cryptoKey.algorithm.name !== "AES-CBC") {
                throw Error("CryptoKeyStore::exportKey - Unsupported key algorithm ".concat((_b = cryptoKey === null || cryptoKey === void 0 ? void 0 : cryptoKey.algorithm) === null || _b === void 0 ? void 0 : _b.name, ". Supported formats are 'RSA-OAEP' and 'AES-CBC'"));
            }
            /*
                Validate requested Key format by Key algorithm
            */
            if (cryptoKey.algorithm.name === "AES-CBC" &&
                !!format &&
                format !== "raw" &&
                format !== "jwk") {
                throw Error("CryptoKeyStore::exportKey - Unsupported AES-CBC format ".concat(format, ". Supported formats are 'raw' and 'jwk'"));
            }
            if (cryptoKey.algorithm.name === "RSA-OAEP" &&
                !!format &&
                format !== "jwk") {
                throw Error("CryptoKeyStore::exportKey - Unsupported RSA-OAEP format ".concat(format, ". Supported formats are 'jwk'"));
            }
            /*
                Fetch and validate Key data
            */
            var keyData = _this.getCryptoKeyData(cryptoKey);
            if (!keyData) {
                throw Error("CryptoKeyStore::exportKey - No keyData found for provided CryptoKey");
            }
            /*
                Handle AES-CBC export
                NOTICE: In the 'raw' case, the keyData (ArrayBuffer) is unwrap from the Keydata by getting the 'k' key value.
            */
            if (cryptoKey.algorithm.name === "AES-CBC") {
                return Promise.resolve(format === "jwk" ? AESCBCUtils.raw2jwk(cryptoKey, keyData) : keyData.k);
            }
            /*
                Handle RSA-OAEP export
            */
            if (cryptoKey.algorithm.name === "RSA-OAEP") {
                return Promise.resolve(RSAOAEPUtils.raw2jwk(cryptoKey, keyData));
            }
            throw Error("CryptoKeyStore::exportKey - Impossible to export the key");
        };
        this.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
            /*
                Validate Key algorithm
            */
            if (!!(algorithm === null || algorithm === void 0 ? void 0 : algorithm.name) &&
                algorithm.name !== "RSA-OAEP" &&
                algorithm.name !== "AES-CBC") {
                throw Error("CryptoKeyStore::importKey - Unsupported key algorithm ".concat(algorithm.name, ". Supported formats are 'RSA-OAEP' and 'AES-CBC'"));
            }
            /*
                Validate provided Key format by Key algorithm
            */
            if (algorithm.name === "AES-CBC" &&
                !!format &&
                format !== "raw" &&
                format !== "jwk") {
                throw Error("CryptoKeyStore::importKey - Unsupported AES-CBC format ".concat(format, ". Supported formats are 'raw' and 'jwk'"));
            }
            if (algorithm.name === "RSA-OAEP" && !!format && format !== "jwk") {
                throw Error("CryptoKeyStore::importKey - Unsupported RSA-OAEP format ".concat(format, ". Supported formats are 'jwk'"));
            }
            /*
                Handle AES-CBC import
            */
            if (algorithm.name === "AES-CBC") {
                var cryptoKeyData = format === "jwk"
                    ? AESCBCUtils.jwk2raw(keyData)
                    : abs2kd([keyData], AES_KEY_DATA_KEYS);
                var cryptoKey = __assign({
                    algorithm: algorithm,
                    extractable: extractable,
                    usages: __spreadArray([], keyUsages, true),
                    type: "secret",
                });
                _this.addCryptoKeyData(cryptoKey, cryptoKeyData);
                return Promise.resolve(cryptoKey);
            }
            /*
                Handle RSA-OAEP import
            */
            if (algorithm.name === "RSA-OAEP" && format === "jwk") {
                var cryptoKeyData = RSAOAEPUtils.jwk2raw(keyData);
                var cryptoKey = __assign({
                    algorithm: algorithm,
                    extractable: extractable,
                    usages: __spreadArray([], keyUsages, true),
                    type: cryptoKeyData.d || cryptoKeyData.dq ? "private" : "public",
                });
                _this.addCryptoKeyData(cryptoKey, cryptoKeyData);
                return Promise.resolve(cryptoKey);
            }
            throw Error("CryptoKeyStore::importKey - Impossible to import the key");
        };
        this.keys = [];
    }
    CryptoKeyStore.getInstance = function () {
        if (!CryptoKeyStore.instance) {
            CryptoKeyStore.instance = new CryptoKeyStore();
        }
        return CryptoKeyStore.instance;
    };
    return CryptoKeyStore;
}());
exports.CryptoKeyStore = CryptoKeyStore;
