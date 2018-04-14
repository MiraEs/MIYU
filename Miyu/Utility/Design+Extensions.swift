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
        self.textColor = UIColor(red:0.59, green:0.52, blue:0.50, alpha:1.0)
    }
    
    func mediumFont() {
        self.font = UIFont(name: FontFamilies.avenirLight, size: 16)
        self.textColor = UIColor(red:0.59, green:0.52, blue:0.50, alpha:1.0)
    }
    
    func largeFont() {
        self.font = UIFont(name: FontFamilies.avenirLight, size: 25)
        //self.textColor = UIColor(red:0.59, green:0.52, blue:0.50, alpha:1.0)
        self.textColor = UIColor.red
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
