//
//  RNIcureAES.swift
//  RNIcureCrypto
//
//  Created by Philippe Mertens on 29/07/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

@objc(RNIcureAES)
class RNIcureAES: NSObject {
    
    @objc
    static
    func requiresMainQueueSetup() -> Bool {
      return false
    }
}
