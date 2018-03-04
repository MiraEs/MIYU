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
    static let avenirNextUltraLight = "AvenirNext-UltraLight"
}

extension UILabel {
    func largeFont() {
        self.font = UIFont(name: FontFamilies.avenirNextDemiBold, size: 40)
    }
    
    func mediumFont() {
        self.font = UIFont(name: FontFamilies.avenirNextUltraLight, size: 18)
    }
    
    func smallFontLight() {
        self.font = UIFont(name: FontFamilies.avenirNextUltraLight, size: 15)
    }
    
    func smallFontBold() {
           self.font = UIFont(name: FontFamilies.avenirNextDemiBold, size: 15)
    }
}
