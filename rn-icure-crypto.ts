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

import { NativeModules } from "react-native";

const { RNIcureRSA, RNIcureAES } = NativeModules;

import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";
import {
  b642ab,
  b642ua,
  string2ab,
  ua2b64,
  ua2string,
} from "./utils/binary-utils";
import { CryptoKeyStore } from "./utils/key-store";
import {
  pkcs8ToJwk,
  spkiToJwk,
  stringifyPrivateJWK,
  stringifyPublicJWK,
} from "./utils/key-utils";

const store = CryptoKeyStore.getInstance();

const decrypt = async (
  algorithm: RsaOaepParams | AesCbcParams,
  key: CryptoKey,
  data: BufferSource
) => {
  try {
    if (algorithm.name === "RSA-OAEP") {
      const privateKey = stringifyPrivateJWK(
        (await exportKey("jwk", key)) as JsonWebKey
      );
      const toDecrypt = ua2b64(data as ArrayBuffer);
      const decrypted = await RNIcureRSA.decrypt(toDecrypt, privateKey);

      if (!!decrypted) {
        return string2ab(decrypted);
      }
    }

    if (algorithm.name === "AES-CBC") {
      const aesKey = ua2b64((await exportKey("raw", key)) as ArrayBuffer);
      const toDecrypt = ua2b64(data as ArrayBuffer);
      const iv = ua2b64((algorithm as AesCbcParams).iv as ArrayBuffer);
      const decrypted = await RNIcureAES.decrypt(toDecrypt, aesKey, iv);
      if (!!decrypted) {
        return b642ua(decrypted);
      }
    }

    throw Error(`RNIcureCrypto::decrypt - No support`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const encrypt = async (
  algorithm: RsaOaepParams | AesCbcParams,
  key: CryptoKey,
  data: BufferSource
) => {
  try {
    if (algorithm.name === "RSA-OAEP") {
      const publicKey = stringifyPublicJWK(
        (await exportKey("jwk", key)) as JsonWebKey
      );
      const toEncrypt = ua2string(data as ArrayBuffer);

      const encrypted = await RNIcureRSA.encrypt(toEncrypt, publicKey);

      if (!!encrypted) {
        return b642ab(encrypted);
      }
    }

    if (algorithm.name === "AES-CBC") {
      const aesKey = ua2b64((await exportKey("raw", key)) as ArrayBuffer);
      const toEncrypt = ua2b64(data as ArrayBuffer);
      const iv = ua2b64((algorithm as AesCbcParams).iv as ArrayBuffer);

      const encrypted = await RNIcureAES.encrypt(toEncrypt, aesKey, iv);

      if (!!encrypted) {
        return b642ua(encrypted);
      }
    }

    throw Error(`RNIcureCrypto::encrypt - No support`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const exportKey = async (
  format: "jwk" | "raw",
  key: CryptoKey
): Promise<JsonWebKey | ArrayBuffer> => {
  try {
    if (
      key?.algorithm?.name === "AES-CBC" ||
      key?.algorithm?.name === "RSA-OAEP"
    ) {
      return await store.exportKey(format, key);
    }

    throw Error(`RNIcureCrypto::exportKey - No support`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const generateKey = async (
  algorithm: RsaKeyAlgorithm | AesKeyGenParams,
  extractable: boolean,
  keyUsages: ReadonlyArray<KeyUsage>
): Promise<CryptoKeyPair | CryptoKey> => {
  try {
    if (algorithm.name === "RSA-OAEP") {
      const keyPair = await RNIcureRSA.generateKey(
        (algorithm as RsaKeyAlgorithm).modulusLength
      );

      const publicKey: CryptoKey = await importKey(
        "jwk",
        spkiToJwk(b642ua(keyPair.public)),
        algorithm as RsaKeyAlgorithm,
        extractable,
        ["encrypt"]
      );

      const privateKey: CryptoKey = await importKey(
        "jwk",
        pkcs8ToJwk(b642ab(keyPair.private) as ArrayBuffer),
        algorithm as RsaKeyAlgorithm,
        extractable,
        ["decrypt"]
      );

      return {
        publicKey,
        privateKey,
      };
    }

    if (algorithm.name === "AES-CBC") {
      const nativeKey = await RNIcureAES.generateKey(
        (algorithm as AesKeyGenParams).length
      );
      const nativeRawKey = new Uint8Array(b642ab(nativeKey));
      const cryptoKey = await importKey(
        "raw",
        nativeRawKey,
        algorithm as AesKeyGenParams,
        extractable,
        keyUsages
      );

      return cryptoKey;
    }

    throw Error(`RNIcureCrypto::generateKey - No support`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const importKey = async (
  format: "jwk" | "raw",
  keyData: JsonWebKey | BufferSource,
  algorithm: RsaKeyAlgorithm | AesKeyAlgorithm,
  extractable: boolean,
  keyUsages: ReadonlyArray<KeyUsage>
): Promise<CryptoKey> => {
  try {
    if (algorithm?.name === "AES-CBC" || algorithm?.name === "RSA-OAEP") {
      return await store.importKey(
        format,
        keyData,
        algorithm,
        extractable,
        keyUsages
      );
    }

    throw Error(`RNIcureCrypto::importKey - No support`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const randomUUID = () => {
  return uuidv4();
};

const crypto: Crypto = {
  getRandomValues: global.crypto.getRandomValues,
  subtle: {
    encrypt: encrypt,
    decrypt: decrypt,
    exportKey: exportKey,
    importKey: importKey,
    generateKey: generateKey,
    deriveBits: () => {
      throw Error(`RNIcureCrypto::deriveBits - Not implemented`);
    },
    deriveKey: () => {
      throw Error(`RNIcureCrypto::deriveKey - Not implemented`);
    },
    digest: () => {
      throw Error(`RNIcureCrypto::digest - Not implemented`);
    },
    sign: () => {
      throw Error(`RNIcureCrypto::sign - Not implemented`);
    },
    unwrapKey: () => {
      throw Error(`RNIcureCrypto::unwrapKey - Not implemented`);
    },
    verify: () => {
      throw Error(`RNIcureCrypto::verify - Not implemented`);
    },
    wrapKey: () => {
      throw Error(`RNIcureCrypto::wrapKey - Not implemented`);
    },
  } as SubtleCrypto,
  randomUUID: randomUUID,
};

export default {
  ...crypto,
};
