//
//  AESNative.swift
//  react-native-icure-crypto
//
//  Created by Philippe Mertens on 15/08/2022.
//

import Foundation
import CommonCrypto

enum AESError: Error {
    //  CCCrypt error
    case cccryptError
    
    //  Crypt data buffer oversize error
    case oversizeError
    
    //  Crypt data buffer modulo size error
    case modulosizeError
    
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
                                  kCCKeySizeAES256,
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
                                  kCCKeySizeAES256,
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
}
