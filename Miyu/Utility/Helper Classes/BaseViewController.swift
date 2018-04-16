//
//  BaseViewController.swift
//  Simi
//
//  Created by Mira Estil on 1/30/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

internal class BaseViewController: UIViewController, CAAnimationDelegate {

    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
    }
    
    private func setup() {
        gradientBackground()
        keyboardFunctionality()
    }
 
    private func gradientBackground() {
        
        let pink7 = UIColor(red:0.95, green:0.63, blue:0.51, alpha:0.5).cgColor
        let pink8 = UIColor(red:0.93, green:0.44, blue:0.40, alpha:0.5).cgColor
        
        let gradientLayer = CAGradientLayer()
        gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.0)
        gradientLayer.endPoint = CGPoint(x: 1.0, y: 1.0)
        
        gradientLayer.frame = self.view.bounds
        
        gradientLayer.colors = [pink7, pink8, pink7]

        //gradientLayer.locations = [0.0, 0.62]
        view.layer.insertSublayer(gradientLayer, at: 0)
        
    }
    
    private func keyboardFunctionality() {
        self.hideKeyboardWhenTap()
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillShow), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillHide), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
}
