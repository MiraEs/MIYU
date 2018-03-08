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
    static let avenirLight = "Avenir Next"
}

// MARK: UILabel
extension UILabel {
    func smallFont() {
        self.font = UIFont(name: FontFamilies.avenirLight, size: 13)
    }
    
    func mediumFont() {
        self.font = UIFont(name: FontFamilies.avenirLight, size: 16)
    }
    
    func largeFont() {
        self.font = UIFont(name: FontFamilies.avenirLight, size: 25)
    }
    
}

// MARK: UIImage

extension UIImageView {
    func setRounded() {
        self.contentMode = UIViewContentMode.scaleAspectFill
        self.layer.borderWidth = 1
        self.layer.masksToBounds = false
        self.layer.borderColor = UIColor.white.cgColor
        self.layer.cornerRadius = self.frame.height/2
        self.clipsToBounds = true
    }
}
