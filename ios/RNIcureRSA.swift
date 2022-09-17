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
 
import Foundation

@objc(RNIcureRSA)
class RNIcureRSA: NSObject {
    
    @objc
    static
    func requiresMainQueueSetup() -> Bool {
      return false
    }

    @objc
    func encrypt(_ message: String, key: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        let RSA_native = RSANative()

        guard let _ = RSA_native.setPublicKey(publicKey: key) else {
            resolve(false)
            return
        }
        
        let msg = RSA_native.encrypt(message: message)
        resolve(msg)
    }
    
    @objc
    func decrypt(_ message: String , key: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        let RSA_native = RSANative()
        
        guard let _ = RSA_native.setPrivateKey(privateKey: key) else {
            resolve(false)
            return
        }
        
        let msg = RSA_native.decrypt(message: message)
        resolve(msg)
    }
    
    @objc
    func generateKey(_ keySize: Int, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        let RSA_native = RSANative()
        let res = RSA_native.generate(keySize: keySize)
        if(res ?? false){
            let pub = RSA_native.encodedPublicKeyDER()
            let prv = RSA_native.encodedPrivateKeyRSA()
            let keys = ["public": pub, "private": prv]
            resolve(keys)
            return
        }
        resolve(false)
    }
}
