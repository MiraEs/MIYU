//
//  LoginViewController.swift
//  Miyu
//
//  Created by Mira Estil on 1/29/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit



class LoginViewController: BaseViewController {
    
    var homeVC: UIViewController {
        return HomepageViewController.instantiate(fromAppStoryboard: .HomepageViewController)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
    
        setup()
    }
    
    // MARK: SETUP
    
    private func setup() {
        self.view.backgroundColor = UIColor(red:0.92, green:0.74, blue:0.74, alpha:1.0)
    }

    @IBAction func loginDidTap(_ sender: Any) {
        present(homeVC, animated: true, completion: nil)
    }
    
}
