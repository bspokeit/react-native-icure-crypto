/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of react-native-icure-crypto.
 *
 * react-native-icure-crypto is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * react-native-icure-crypto is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with react-native-icure-crypto.  If not, see <http://www.gnu.org/licenses/>.
 */

#import "RNIcureCrypto.h"

@interface RCT_EXTERN_MODULE(RNIcureRSA, NSObject)

    RCT_EXTERN_METHOD(decrypt:(NSString *)message key:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(encrypt:(NSString *)message key:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(generateKey:(int)keySize resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
