import { NativeModules } from "react-native";

const { RNIcureRSA, RNIcureAES } = NativeModules;

export { RNIcureRSA, RNIcureAES };

export default {
  RSA: RNIcureRSA,
  AES: RNIcureAES,
};
