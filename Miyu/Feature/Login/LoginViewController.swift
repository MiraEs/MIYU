//
//  LoginViewController.swift
//  Miyu
//
//  Created by Mira Estil on 1/29/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit



class LoginViewController: UIViewController {
    
    var homeVC: UIViewController {
        return HomepageViewController.instantiate(fromAppStoryboard: .HomepageViewController)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

    
    }

    @IBAction func loginDidTap(_ sender: Any) {
        present(homeVC, animated: true, completion: nil)
    }
    
}
