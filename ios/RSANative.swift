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

typealias SecKeyPerformBlock = (SecKey) -> ()

class RSANative: NSObject {
    var publicKey: SecKey?
    var privateKey: SecKey?
    let keyAlgorithm = SecKeyAlgorithm.rsaEncryptionOAEPSHA1
    
    var publicKeyTag = ".public"
    var privateKeyTag = ".private"
    
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
        }
        
        //  No suport for IOS version < 10.0
        return false
    }
    
    public func setPrivateKey(privateKey: String) -> Bool? {
        if #available(iOS 10.0, *) {
            let query: [String: AnyObject] = [
                String(kSecAttrKeyType): kSecAttrKeyTypeRSA,
                String(kSecAttrKeyClass): kSecAttrKeyClassPrivate,
            ]
            
            var error: Unmanaged<CFError>?
            
            guard let data = Data(base64Encoded: privateKey, options: .ignoreUnknownCharacters) else { return false }
            guard let key = SecKeyCreateWithData(data as CFData, query as CFDictionary, &error) else { return false }
            
            self.privateKey = key
            
            return true
        }
        
        //  No suport for IOS version < 10.0
        return false
    }
    
    public func encrypt(message: String) -> String? {
        guard let data = message.data(using: .utf8) else {
            return nil
        }
        
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
            }
            
            //  No suport for IOS version < 10.0
        }
        
        if (self.publicKey != nil) {
            encryptor(self.publicKey!)
        }

        return cipherText;
    }
    
    public func decrypt(message: String) -> String? {
        guard let data =  Data(base64Encoded: message, options: .ignoreUnknownCharacters) else {
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
                
            }
            
            //  No suport for IOS version < 10.0
        }
        
        if (self.privateKey != nil) {
            decryptor(self.privateKey!)
        }
        
        return clearText
    }
    
    public func generate(keySize: Int) -> Bool? {
        let publicKeyParameters: [String: AnyObject] = [
            String(kSecAttrIsPermanent): kCFBooleanTrue
        ]

        let privateKeyParameters: [String: AnyObject] = [
            String(kSecAttrIsPermanent): kCFBooleanTrue
        ]
            
        var parameters: [String: AnyObject] = [
            String(kSecReturnRef): kCFBooleanTrue,
            kSecPublicKeyAttrs as String: publicKeyParameters as AnyObject,
            kSecPrivateKeyAttrs as String: privateKeyParameters as AnyObject,
        ]
        parameters[String(kSecAttrKeySizeInBits)] = keySize as AnyObject
        parameters[String(kSecAttrKeyType)] = kSecAttrKeyTypeRSA
        
        if #available(iOS 10.0, *) {
            
            var error: Unmanaged<CFError>?
            self.privateKey = SecKeyCreateRandomKey(parameters as CFDictionary, &error)
            
            if self.privateKey == nil {
                print("Error occured: keys weren't created")
                return nil
            }
            
            self.publicKey = SecKeyCopyPublicKey(self.privateKey!)
            
        } else {
            //  No suport for IOS version < 10.0
            return nil
        }
            
        guard self.publicKey != nil else {
            print( "PublicKey shouldn't be nil")
            return nil
        }
        
        guard self.privateKey != nil else{
            print("PrivateKey shouldn't be nil")
            return nil
        }
        return true
    }
    
    public func encodedPrivateKeyRSA() -> String? {
        if(self.privateKey == nil) { return nil }
        return self.externalRepresentationForPrivateKey(key: self.privateKey!)
    }
    
    public func encodedPublicKeyDER() -> String? {
        if(self.publicKey == nil) { return nil }
        return self.externalRepresentationForPublicKey(key: self.publicKey!)
    }
    
    
    private func externalRepresentationForPrivateKey(key: SecKey) -> String? {
        guard let data = self.dataForKey(key: key) else { return nil }
        return String(data.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0)))
    }
    
    private func externalRepresentationForPublicKey(key: SecKey) -> String? {
        guard let data = self.dataForKey(key: key) else { return nil }
        let convertedData = RSAKeyEncoding().convertToX509EncodedKey(data)
        return String(convertedData.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0)))
    }
    
    private func dataForKey(key: SecKey) -> Data? {
        var error: Unmanaged<CFError>?

        if #available(iOS 10.0, *) {
            return SecKeyCopyExternalRepresentation(key, &error) as Data?
        } else {
            //  No suport for IOS version < 10.0
            return nil
        }
    }
}
