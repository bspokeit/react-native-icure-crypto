export declare const ua2string: (_ua: Uint8Array | ArrayBuffer) => string;
export declare const string2ua: (s: string) => Uint8Array;
export declare const string2ab: (s: string) => ArrayBuffer;
export declare const b2a: (a: string) => string;
export declare const a2b: (s: string) => string;
export declare const ua2ab: (ua: Uint8Array) => ArrayBuffer;
export declare const b642ab: (s: string) => ArrayBuffer;
export declare const b642ua: (s: string) => Uint8Array;
export declare const ua2b64: (_ua: Uint8Array | ArrayBuffer) => string;
export declare const ua2b64Url: (_ua: Uint8Array | ArrayBuffer) => string;
export declare const b64Url2ua: (ua: string) => ArrayBuffer;
export declare const hex2ua: (s: string) => Uint8Array;
/**
 * Uint8Array/ArrayBuffer to hex String
 *
 * @param _ua {Uint8Array} or ArrayBuffer
 * @returns {String} Hex String
 */
export declare const ua2hex: (_ua: Uint8Array | ArrayBuffer) => string;
