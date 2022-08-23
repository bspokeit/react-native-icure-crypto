declare module "react-native-icure-crypto" {
  interface KeyPair {
    public: string;
    private: string;
  }
  namespace RNIcureRSA {
    export function encrypt(data: string, key: string): Promise<string>;
    export function decrypt(data: string, key: string): Promise<string>;
    export function generateKey(keySize: number): Promise<KeyPair>;
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

    export function generateKey(keySize: number): Promise<string>;
  }

  export { RNIcureRSA, RNIcureAES };
}
