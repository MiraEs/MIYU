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
    static let avenirLight = "Avenir-Light"
    static let avenirOblique = "Avenir-Oblique"
}

extension UILabel {
    func smallFontLight() {
        self.font = UIFont(name: FontFamilies.avenirNextUltraLight, size: 15)
    }
    
    func smallFontBold() {
        self.font = UIFont(name: FontFamilies.avenirNextDemiBold, size: 15)
    }
    
    func mediumFont() {
        self.font = UIFont(name: FontFamilies.avenirNextUltraLight, size: 18)
    }
    
    func mediumFontLight() {
        self.font = UIFont(name: FontFamilies.avenirLight, size: 18)
    }
    
    func mediumFontObique() {
        self.font = UIFont(name: FontFamilies.avenirOblique, size: 22)
    }
    
    func largeFontBold() {
        self.font = UIFont(name: FontFamilies.avenirNextDemiBold, size: 40)
    }
    
    func largeFontLight() {
        self.font = UIFont(name: FontFamilies.avenirLight, size: 30)
    }
    
    
}
