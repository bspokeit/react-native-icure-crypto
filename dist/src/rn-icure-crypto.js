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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var RNIcureRSA = react_native_1.NativeModules.RNIcureRSA, RNIcureAES = react_native_1.NativeModules.RNIcureAES;
require("react-native-get-random-values");
var uuid_1 = require("uuid");
var binary_utils_1 = require("./utils/binary-utils");
var key_store_1 = require("./utils/key-store");
var key_utils_1 = require("./utils/key-utils");
var store = key_store_1.CryptoKeyStore.getInstance();
var decrypt = function (algorithm, key, data) { return __awaiter(void 0, void 0, void 0, function () {
    var privateKey, _a, toDecrypt, decrypted, aesKey, _b, toDecrypt, iv, decrypted, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                if (!(algorithm.name === "RSA-OAEP")) return [3 /*break*/, 3];
                _a = key_utils_1.stringifyPrivateJWK;
                return [4 /*yield*/, exportKey("jwk", key)];
            case 1:
                privateKey = _a.apply(void 0, [(_c.sent())]);
                toDecrypt = (0, binary_utils_1.ua2b64)(data);
                return [4 /*yield*/, RNIcureRSA.decrypt(toDecrypt, privateKey)];
            case 2:
                decrypted = _c.sent();
                if (!!decrypted) {
                    return [2 /*return*/, (0, binary_utils_1.string2ab)(decrypted)];
                }
                _c.label = 3;
            case 3:
                if (!(algorithm.name === "AES-CBC")) return [3 /*break*/, 6];
                _b = binary_utils_1.ua2b64;
                return [4 /*yield*/, exportKey("raw", key)];
            case 4:
                aesKey = _b.apply(void 0, [(_c.sent())]);
                toDecrypt = (0, binary_utils_1.ua2b64)(data);
                iv = (0, binary_utils_1.ua2b64)(algorithm.iv);
                return [4 /*yield*/, RNIcureAES.decrypt(toDecrypt, aesKey, iv)];
            case 5:
                decrypted = _c.sent();
                if (!!decrypted) {
                    return [2 /*return*/, (0, binary_utils_1.b642ua)(decrypted)];
                }
                _c.label = 6;
            case 6: throw Error("RNIcureCrypto::decrypt - No support");
            case 7:
                error_1 = _c.sent();
                console.error(error_1);
                throw error_1;
            case 8: return [2 /*return*/];
        }
    });
}); };
var encrypt = function (algorithm, key, data) { return __awaiter(void 0, void 0, void 0, function () {
    var publicKey, _a, toEncrypt, encrypted, aesKey, _b, toEncrypt, iv, encrypted, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                if (!(algorithm.name === "RSA-OAEP")) return [3 /*break*/, 3];
                _a = key_utils_1.stringifyPublicJWK;
                return [4 /*yield*/, exportKey("jwk", key)];
            case 1:
                publicKey = _a.apply(void 0, [(_c.sent())]);
                toEncrypt = (0, binary_utils_1.ua2string)(data);
                return [4 /*yield*/, RNIcureRSA.encrypt(toEncrypt, publicKey)];
            case 2:
                encrypted = _c.sent();
                if (!!encrypted) {
                    return [2 /*return*/, (0, binary_utils_1.b642ab)(encrypted)];
                }
                _c.label = 3;
            case 3:
                if (!(algorithm.name === "AES-CBC")) return [3 /*break*/, 6];
                _b = binary_utils_1.ua2b64;
                return [4 /*yield*/, exportKey("raw", key)];
            case 4:
                aesKey = _b.apply(void 0, [(_c.sent())]);
                toEncrypt = (0, binary_utils_1.ua2b64)(data);
                iv = (0, binary_utils_1.ua2b64)(algorithm.iv);
                return [4 /*yield*/, RNIcureAES.encrypt(toEncrypt, aesKey, iv)];
            case 5:
                encrypted = _c.sent();
                if (!!encrypted) {
                    return [2 /*return*/, (0, binary_utils_1.b642ua)(encrypted)];
                }
                _c.label = 6;
            case 6: throw Error("RNIcureCrypto::encrypt - No support");
            case 7:
                error_2 = _c.sent();
                console.error(error_2);
                throw error_2;
            case 8: return [2 /*return*/];
        }
    });
}); };
var exportKey = function (format, key) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                if (!(((_a = key === null || key === void 0 ? void 0 : key.algorithm) === null || _a === void 0 ? void 0 : _a.name) === "AES-CBC" ||
                    ((_b = key === null || key === void 0 ? void 0 : key.algorithm) === null || _b === void 0 ? void 0 : _b.name) === "RSA-OAEP")) return [3 /*break*/, 2];
                return [4 /*yield*/, store.exportKey(format, key)];
            case 1: return [2 /*return*/, _c.sent()];
            case 2: throw Error("RNIcureCrypto::exportKey - No support");
            case 3:
                error_3 = _c.sent();
                console.error(error_3);
                throw error_3;
            case 4: return [2 /*return*/];
        }
    });
}); };
var generateKey = function (algorithm, extractable, keyUsages) { return __awaiter(void 0, void 0, void 0, function () {
    var keyPair, publicKey, privateKey, nativeKey, nativeRawKey, cryptoKey, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(algorithm.name === "RSA-OAEP")) return [3 /*break*/, 4];
                return [4 /*yield*/, RNIcureRSA.generateKey(algorithm.modulusLength)];
            case 1:
                keyPair = _a.sent();
                return [4 /*yield*/, importKey("jwk", (0, key_utils_1.spkiToJwk)((0, binary_utils_1.b642ua)(keyPair.public)), algorithm, extractable, ["encrypt"])];
            case 2:
                publicKey = _a.sent();
                return [4 /*yield*/, importKey("jwk", (0, key_utils_1.pkcs8ToJwk)((0, binary_utils_1.b642ab)(keyPair.private)), algorithm, extractable, ["decrypt"])];
            case 3:
                privateKey = _a.sent();
                return [2 /*return*/, {
                        publicKey: publicKey,
                        privateKey: privateKey,
                    }];
            case 4:
                if (!(algorithm.name === "AES-CBC")) return [3 /*break*/, 7];
                return [4 /*yield*/, RNIcureAES.generateKey(algorithm.length)];
            case 5:
                nativeKey = _a.sent();
                nativeRawKey = new Uint8Array((0, binary_utils_1.b642ab)(nativeKey));
                return [4 /*yield*/, importKey("raw", nativeRawKey, algorithm, extractable, keyUsages)];
            case 6:
                cryptoKey = _a.sent();
                return [2 /*return*/, cryptoKey];
            case 7: throw Error("RNIcureCrypto::generateKey - No support");
            case 8:
                error_4 = _a.sent();
                console.error(error_4);
                throw error_4;
            case 9: return [2 /*return*/];
        }
    });
}); };
var importKey = function (format, keyData, algorithm, extractable, keyUsages) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!((algorithm === null || algorithm === void 0 ? void 0 : algorithm.name) === "AES-CBC" || (algorithm === null || algorithm === void 0 ? void 0 : algorithm.name) === "RSA-OAEP")) return [3 /*break*/, 2];
                return [4 /*yield*/, store.importKey(format, keyData, algorithm, extractable, keyUsages)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: throw Error("RNIcureCrypto::importKey - No support");
            case 3:
                error_5 = _a.sent();
                console.error(error_5);
                throw error_5;
            case 4: return [2 /*return*/];
        }
    });
}); };
var randomUUID = function () {
    return (0, uuid_1.v4)();
};
var crypto = {
    getRandomValues: global.crypto.getRandomValues,
    subtle: {
        encrypt: encrypt,
        decrypt: decrypt,
        exportKey: exportKey,
        importKey: importKey,
        generateKey: generateKey,
        deriveBits: function () {
            throw Error("RNIcureCrypto::deriveBits - Not implemented");
        },
        deriveKey: function () {
            throw Error("RNIcureCrypto::deriveKey - Not implemented");
        },
        digest: function () {
            throw Error("RNIcureCrypto::digest - Not implemented");
        },
        sign: function () {
            throw Error("RNIcureCrypto::sign - Not implemented");
        },
        unwrapKey: function () {
            throw Error("RNIcureCrypto::unwrapKey - Not implemented");
        },
        verify: function () {
            throw Error("RNIcureCrypto::verify - Not implemented");
        },
        wrapKey: function () {
            throw Error("RNIcureCrypto::wrapKey - Not implemented");
        },
    },
    randomUUID: randomUUID,
};
exports.default = __assign({}, crypto);
