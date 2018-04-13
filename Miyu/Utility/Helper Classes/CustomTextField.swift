//
//  CustomTextField.swift
//  Miyu
//
//  Created by Mira Estil on 4/12/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class CustomTextField: UITextField {
    
    override var tintColor: UIColor! {
        didSet {
            setNeedsDisplay()
        }
    }
    
    override func draw(_ rect: CGRect) {
        self.borderStyle = .none
        self.backgroundColor = UIColor.clear
        
        let startingPoint   = CGPoint(x: rect.minX, y: rect.maxY)
        let endingPoint     = CGPoint(x: rect.maxX, y: rect.maxY)
        
        let path = UIBezierPath()
        
        path.move(to: startingPoint)
        path.addLine(to: endingPoint)
        path.lineWidth = 2.0
        
        tintColor.setStroke()
        
        path.stroke()
    }
}
