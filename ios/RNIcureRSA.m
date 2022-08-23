#import "RNIcureCrypto.h"

@interface RCT_EXTERN_MODULE(RNIcureRSA, NSObject)

    RCT_EXTERN_METHOD(decrypt:(NSString *)message key:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(encrypt:(NSString *)message key:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(generateKey:(int)keySize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
