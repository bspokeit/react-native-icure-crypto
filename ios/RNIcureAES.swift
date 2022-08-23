//
//  RNIcureAES.swift
//  RNIcureCrypto
//
//  Created by Philippe Mertens on 29/07/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import CommonCrypto

@objc(RNIcureAES)
class RNIcureAES: NSObject {
    
    @objc
    static
    func requiresMainQueueSetup() -> Bool {
      return false
    }
    

    @objc
    func encrypt(_ message: String, key: String, iv: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        
        guard let data = Data(base64Encoded: message, options: .ignoreUnknownCharacters) else {
            reject("AES Native Encrypt error", "Message parsing failed", nil)
            return
        }
        
        guard let keyData = Data(base64Encoded: key, options: .ignoreUnknownCharacters) else {
            reject("AES Native Encrypt error", "Key parsing failed", nil)
            return
        }
        
        guard keyData.count == kCCKeySizeAES128 || keyData.count == kCCKeySizeAES192 || keyData.count == kCCKeySizeAES256 else {
            reject("AES Native Encrypt error", "Key size issue (expecting 128/192/256 AES-CBC keys)", nil)
            return
        }
        
        guard let ivData = Data(base64Encoded: iv, options: .ignoreUnknownCharacters) else {
            reject("AES Native Encrypt error", "Initialization vector parsing failed", nil)
            return
        }
        
        guard ivData.count == kCCBlockSizeAES128 else {
            reject("AES Native Encrypt error", "IV size issue (expecting 128 Initialization Vector)", nil)
            return
        }
        
        do {
            let AES_native = AESNative()
            let msg = try AES_native.encrypt(data: data, keyData: keyData, ivData: ivData)
            
            resolve(msg)
        } catch {
            reject("AES Native Encrypt error", "Encrypt error", error)
        }
    }
    
    @objc
    func decrypt(_ message: String, key: String, iv: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {

        guard let data = Data(base64Encoded: message, options: .ignoreUnknownCharacters) else {
            reject("AES Native Decrypt error", "Message parsing failed", nil)
            return
        }
        
        guard let keyData = Data(base64Encoded: key, options: .ignoreUnknownCharacters) else {
            reject("AES Native Decrypt error", "Key parsing failed", nil)
            return
        }
        
        guard keyData.count == kCCKeySizeAES128 || keyData.count == kCCKeySizeAES192 || keyData.count == kCCKeySizeAES256 else {
            reject("AES Native Decrypt error", "Key size issue (expecting 128/192/256 AES-CBC key)", nil)
            return
        }
        
        guard let ivData = Data(base64Encoded: iv, options: .ignoreUnknownCharacters) else {
            reject("AES Native Decrypt error", "Initialization vector parsing failed", nil)
            return
        }
        
        guard ivData.count == kCCBlockSizeAES128 else {
            reject("AES Native Decrypt error", "IV size issue (expecting 128 Initialization Vector)", nil)
            return
        }
        
        do {
            let AES_native = AESNative()
            let msg = try AES_native.decrypt(data: data, keyData: keyData, ivData: ivData)
            
            resolve(msg)
        } catch AESError.oversizeError {
            reject("AES Native Decrypt error", "Decrypt error (oversize)", nil)
        } catch AESError.cccryptError {
            reject("AES Native Decrypt error", "Decrypt error (cccrypt)", nil)
        } catch {
            reject("AES Native Decrypt error", "Decrypt error", error)
        }
    }
    
    @objc
    func generateKey(_ keySize: Int, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        
        guard keySize % 8 != 0 else {
            reject("AES Native GenerateKey error", "Key size issue (AES-CBC key length expected to be multiple of 8)", nil)
            return
        }
        
        do {
            let AES_native = AESNative()
            let key = try AES_native.generate(keySize: keySize / 8)
            
            resolve(key)
        } catch AESError.generateError {
            reject("AES Native GenerateKey error", "Key generation error", nil)
        } catch {
            reject("AES Native GenerateKey error", "GenerateKey error", error)
        }
    }
}
