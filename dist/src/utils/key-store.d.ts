export declare class CryptoKeyStore {
    private static instance;
    private keys;
    private constructor();
    static getInstance(): CryptoKeyStore;
    private addCryptoKeyData;
    private getCryptoKeyData;
    private removeCryptoKeyData;
    exportKey: (format: "jwk" | "raw", cryptoKey: CryptoKey) => Promise<JsonWebKey | ArrayBuffer>;
    importKey: (format: "jwk" | "raw", keyData: JsonWebKey | BufferSource, algorithm: RsaKeyAlgorithm | AesKeyAlgorithm, extractable: boolean, keyUsages: ReadonlyArray<KeyUsage>) => Promise<CryptoKey>;
}
