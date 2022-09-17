export declare type Asn1 = {
    type: number;
    lengthSize: number;
    length: number;
    children?: Asn1[];
    value?: Uint8Array;
};
export declare function parseAsn1(buf: Uint8Array, depth?: number[], eager?: boolean): Asn1;
