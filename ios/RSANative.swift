//
//  RSANative.swift
//  RNIcureCrypto
//
//  Created by Philippe Mertens on 29/07/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import CommonCrypto

typealias SecKeyPerformBlock = (SecKey) -> ()


class RSANative: NSObject {
    var publicKey: SecKey?
    var privateKey: SecKey?
    
    public func setPublicKey(publicKey: String) -> Bool? {
        if #available(iOS 10.0, *) {
            let query: [String: AnyObject] = [
                String(kSecAttrKeyType): kSecAttrKeyTypeRSA,
                String(kSecAttrKeyClass): kSecAttrKeyClassPublic,
            ]
        
            var error: Unmanaged<CFError>?
        
            guard let data = Data(base64Encoded: publicKey, options: .ignoreUnknownCharacters) else { return false }
            guard let key = SecKeyCreateWithData(data as CFData, query as CFDictionary, &error) else { return false }
            self.publicKey = key
            
            return true
        } else {
            // Fallback on earlier versions. Not available yet.
            return false
        }
    }
    
    public func setPrivateKey(privateKey: String) -> Bool? {
        if #available(iOS 10.0, *) {
            let query: [String: AnyObject] = [
                String(kSecAttrKeyType): kSecAttrKeyTypeRSA,
                String(kSecAttrKeyClass): kSecAttrKeyClassPrivate,
            ]
            
            var error: Unmanaged<CFError>?
            
            guard let data = Data(base64Encoded: privateKey, options: .ignoreUnknownCharacters) else { return nil }
        
        
            guard let key = SecKeyCreateWithData(data as CFData, query as CFDictionary, &error) else { return nil }
            self.privateKey = key
            return true
        } else {
            // Fallback on earlier versions. Not available yet.
            return nil
        }
    }
    
    public func encrypt(message: String) -> String? {
        guard let data =  message.data(using: .utf8) else { return nil }
        let encrypted = self._encrypt(data: data)
        return encrypted?.base64EncodedString(options: .lineLength64Characters)
    }
    
    public func _encrypt(data: Data) -> Data? {
        var cipherText: Data?
        
        let encryptor:SecKeyPerformBlock = { publicKey in
            if #available(iOS 10.0, *) {
                let canEncrypt = SecKeyIsAlgorithmSupported(publicKey, .encrypt, .rsaEncryptionOAEPSHA1)
                if(canEncrypt){
                    var error: Unmanaged<CFError>?
                    cipherText = SecKeyCreateEncryptedData(publicKey, .rsaEncryptionOAEPSHA1, data as CFData, &error) as Data?
                }
            } else {
                // Fallback on earlier versions. Not available yet.
            };
        }
        
        encryptor(self.publicKey!);

        return cipherText;
    }
    
    public func decrypt(message: String) -> String? {
        guard let data =  Data(base64Encoded: message, options: .ignoreUnknownCharacters) else {
            print("Base64 guard nil return!")
            return nil
        }
        
        let decrypted = self._decrypt(data: data)
        if (decrypted == nil) {
            return nil
        }
        return String(data: decrypted!, encoding: String.Encoding.utf8)
    }
    
    private func _decrypt(data: Data) -> Data? {
        var clearText: Data?
        let decryptor: SecKeyPerformBlock = {privateKey in
            if #available(iOS 10.0, *) {
                let canEncrypt = SecKeyIsAlgorithmSupported(privateKey, .decrypt, .rsaEncryptionOAEPSHA1)
                if(canEncrypt){
                    var error: Unmanaged<CFError>?
                    clearText = SecKeyCreateDecryptedData(privateKey, .rsaEncryptionOAEPSHA1, data as CFData, &error) as Data?
                }
                
            } else {
                // Fallback on earlier versions. Not available yet.
            };
        }
        
        decryptor(self.privateKey!);
        
        return clearText
    }
}
