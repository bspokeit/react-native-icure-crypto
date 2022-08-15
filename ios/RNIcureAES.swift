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
            reject("Message parsing failed", "Encrypt error", nil)
            return
        }
        
        guard let keyData = Data(base64Encoded: key, options: .ignoreUnknownCharacters) else {
            reject("Key parsing failed", "Encrypt error", nil)
            return
        }
        
        guard keyData.count == kCCKeySizeAES256 else {
            reject("Key size issue (expecting 256 AES-CBC key)", "Encrypt error", nil)
            return
        }
        
        guard let ivData = Data(base64Encoded: iv, options: .ignoreUnknownCharacters) else {
            reject("Initialization vector parsing failed", "Encrypt error", nil)
            return
        }
        
        guard ivData.count == kCCBlockSizeAES128 else {
            reject("IV size issue (expecting 128 Initialization Vector)", "Encrypt error", nil)
            return
        }
        
        do {
            let AES_native = AESNative()
            let msg = try AES_native.encrypt(data: data, keyData: keyData, ivData: ivData)
            
            resolve(msg)
        } catch {
            reject("AES Native error", "Encrypt error", error)
        }
    }
    
    @objc
    func decrypt(_ message: String, key: String, iv: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {

        guard let data = Data(base64Encoded: message, options: .ignoreUnknownCharacters) else {
            reject("Message parsing failed", "Decrypt error 1", nil)
            return
        }
        
        guard let keyData = Data(base64Encoded: key, options: .ignoreUnknownCharacters) else {
            reject("Key parsing failed", "Decrypt error 2", nil)
            return
        }
        
        guard keyData.count == kCCKeySizeAES256 else {
            reject("Key size issue (expecting 256 AES-CBC key)", "Decrypt error 3", nil)
            return
        }
        
        guard let ivData = Data(base64Encoded: iv, options: .ignoreUnknownCharacters) else {
            reject("Initialization vector parsing failed", "Decrypt error 4", nil)
            return
        }
        
        guard ivData.count == kCCBlockSizeAES128 else {
            reject("IV size issue (expecting 128 Initialization Vector)", "Decrypt error 5", nil)
            return
        }
        
        do {
            let AES_native = AESNative()
            let msg = try AES_native.decrypt(data: data, keyData: keyData, ivData: ivData)
            
            resolve(msg)
        } catch AESError.oversizeError {
            reject("AES Native error", "Decrypt error 6.1", nil)
        } catch AESError.modulosizeError {
            reject("AES Native error", "Decrypt error 6.2", nil)
        } catch AESError.cccryptError {
            reject("AES Native error", "Decrypt error 6.3", nil)
        } catch {
            reject("AES Native error", "Decrypt error 6", error)
        }
    }
}
