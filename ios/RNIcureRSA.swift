//
//  RNIcureRSA.swift
//  RNIcureCrypto
//
//  Created by Philippe Mertens on 29/07/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

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
