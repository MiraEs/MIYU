//
//  Design+Extensions.swift
//  Miyu
//
//  Created by Mira Estil on 3/3/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Foundation

private enum FontFamilies {
    typealias rawValue = String
    
    static let avenirNextDemiBold = "AvenirNext-DemiBold"
    static let appleSDGothicNeoUltraLight = "AppleSDGothicNeo-UltraLight"
}

extension UILabel {
    func largeFont() {
        self.font = UIFont(name: FontFamilies.avenirNextDemiBold, size: 40)
    }
    
    func mediumFont() {
        self.font = UIFont(name: FontFamilies.appleSDGothicNeoUltraLight, size: 25)
    }
    
    func smallFont() {
        self.font = UIFont(name: FontFamilies.appleSDGothicNeoUltraLight, size: 16)
    }
}
