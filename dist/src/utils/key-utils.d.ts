export declare const jwk2pkcs8: (jwk: any) => string;
export declare const jwk2pkcs1: (jwk: any) => string;
export declare const jwk2spki: (jwk: any) => string;
export declare const spkiToJwk: (buf: Uint8Array) => {
    kty: string;
    alg: string;
    n: string;
    e: string;
    ext: boolean;
};
export declare const pkcs8ToJwk: (buf: Uint8Array | ArrayBuffer) => {
    kty: string;
    n: string;
    e: string;
    d: string;
    p: string;
    q: string;
    dp: string;
    dq: string;
    qi: string;
};
export declare const stringifyPublicJWK: (jwk: JsonWebKey) => string;
export declare const stringifyPrivateJWK: (jwk: JsonWebKey) => string;
