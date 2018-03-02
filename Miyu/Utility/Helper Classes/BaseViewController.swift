//
//  BaseViewController.swift
//  Simi
//
//  Created by Mira Estil on 1/30/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

internal class BaseViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
       
        view.backgroundColor = UIColor(red:0.92, green:0.74, blue:0.74, alpha:1.0)
        self.hideKeyboardWhenTap()
    }
}
