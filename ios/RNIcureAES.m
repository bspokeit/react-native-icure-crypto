#import "RNIcureCrypto.h"

@interface RCT_EXTERN_MODULE(RNIcureAES, NSObject)

    RCT_EXTERN_METHOD(encrypt:(NSString *)message key:(NSString *)key iv:(NSString *)iv resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(decrypt:(NSString *)message key:(NSString *)key iv:(NSString *)iv resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
