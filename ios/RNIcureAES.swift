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
        
        guard keySize % 8 == 0 else {
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
