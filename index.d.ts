declare module "react-native-icure-crypto" {
  namespace RNIcureRSA {
    export function encrypt(data: string, key: string): Promise<string>;
    export function decrypt(data: string, key: string): Promise<string>;
  }

  namespace RNIcureAES {
    export function encrypt(
      data: string,
      key: string,
      iv: string
    ): Promise<string>;
    export function decrypt(
      data: string,
      key: string,
      iv: string
    ): Promise<string>;
  }

  export { RNIcureRSA, RNIcureAES };
}
