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

enum AESError: Error {
    //  CCCrypt error
    case cccryptError
    
    //  Crypt data buffer oversize error
    case oversizeError
    
    //  Crypt data buffer modulo size error
    case modulosizeError
    
    //  Key generation error
    case generateError
    
    case unexpected(code: Int)
}

extension AESError {

}

class AESNative: NSObject {
    
    public func encrypt(data: Data, keyData: Data, ivData: Data) throws -> String? {
        
        var encryptedData = [UInt8](repeating: 0, count: data.count + kCCBlockSizeAES128)
        var encryptedDataBytesCount = 0
        
        let cryptStatus = CCCrypt(CCOperation(kCCEncrypt),
                                  CCAlgorithm(kCCAlgorithmAES),
                                  CCOptions(kCCOptionPKCS7Padding),
                                  [UInt8](keyData),
                                  keyData.count,
                                  (ivData.count != 0) ? [UInt8](ivData) : nil,
                                  [UInt8](data),
                                  data.count,
                                  &encryptedData,
                                  encryptedData.count,
                                  &encryptedDataBytesCount);

        if (cryptStatus == kCCSuccess) {
            
            if(encryptedDataBytesCount > encryptedData.count){
                throw AESError.oversizeError
            }
            
            encryptedData.removeLast(encryptedData.count - encryptedDataBytesCount)
            
            if(!encryptedData.count.isMultiple(of: kCCBlockSizeAES128)) {
                throw AESError.modulosizeError
            }
            
            return Data(encryptedData).base64EncodedString(options: .lineLength64Characters)
        } else {
            throw AESError.cccryptError
        }
    }
    
    public func decrypt(data: Data, keyData: Data, ivData: Data) throws -> String? {
        
        var decryptedData = [UInt8](repeating: 0, count: data.count + kCCBlockSizeAES128)
        var decryptedDataBytesCount = 0
        
        let cryptStatus = CCCrypt(CCOperation(kCCDecrypt),
                                  CCAlgorithm(kCCAlgorithmAES),
                                  CCOptions(kCCOptionPKCS7Padding),
                                  [UInt8](keyData),
                                  keyData.count,
                                  (ivData.count != 0) ? [UInt8](ivData) : nil,
                                  [UInt8](data),
                                  data.count,
                                  &decryptedData,
                                  decryptedData.count,
                                  &decryptedDataBytesCount);

        if (cryptStatus == kCCSuccess) {
            
            if(decryptedDataBytesCount > decryptedData.count){
                throw AESError.oversizeError
            }
            
            decryptedData.removeLast(decryptedData.count - decryptedDataBytesCount)
            
            return Data(decryptedData).base64EncodedString(options: .lineLength64Characters)
        } else {
            throw AESError.cccryptError
        }
    }
    
    public func generate(keySize: Int) throws -> String? {
        var keyData = Data(count: keySize)
        let result = keyData.withUnsafeMutableBytes {
          SecRandomCopyBytes(kSecRandomDefault, keySize, $0.baseAddress!)
        }
         
        guard result == errSecSuccess else {
            throw AESError.generateError
        }

        return keyData.base64EncodedString()
    }
}
