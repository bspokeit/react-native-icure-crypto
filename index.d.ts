/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of react-native-icure-crypto.
 *
 * react-native-icure-crypto is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * react-native-icure-crypto is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with react-native-icure-crypto.  If not, see <http://www.gnu.org/licenses/>.
 */
declare module "react-native-icure-crypto" {
  export namespace RNIcureCrypto {
    export function getRandomValues(): any;
    export namespace subtle {
      export function decrypt(
        algorithm: RsaOaepParams | AesCbcParams,
        key: CryptoKey,
        data: BufferSource
      ): any;
      export function encrypt(
        algorithm: RsaOaepParams | AesCbcParams,
        key: CryptoKey,
        data: BufferSource
      ): any;

      export function exportKey(
        format: "jwk" | "raw",
        key: CryptoKey
      ): Promise<JsonWebKey | ArrayBuffer>;

      export function generateKey(
        algorithm: RsaKeyAlgorithm | AesKeyGenParams,
        extractable: boolean,
        keyUsages: ReadonlyArray<KeyUsage>
      ): Promise<CryptoKeyPair | CryptoKey>;

      export function importKey(
        format: "jwk" | "raw",
        keyData: JsonWebKey | BufferSource,
        algorithm: RsaKeyAlgorithm | AesKeyAlgorithm,
        extractable: boolean,
        keyUsages: ReadonlyArray<KeyUsage>
      ): Promise<CryptoKey>;

      export function deriveBits(): any;
      export function deriveKey(): any;
      export function digest(): any;
      export function sign(): any;
      export function unwrapKey(): any;
      export function verify(): any;
      export function wrapKey(): any;
    }

    export function randomUUID(): string;
  }
}
