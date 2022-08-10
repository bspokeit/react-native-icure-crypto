#import "RNIcureCrypto.h"

@interface RCT_EXTERN_MODULE(RNIcureRSA, NSObject)

RCT_EXTERN_METHOD(decrypt:(NSString *)message withKey:(NSString *)withKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(encrypt:(NSString *)message withKey:(NSString *)withKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
