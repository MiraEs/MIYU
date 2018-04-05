//
//  LoginViewController.swift
//  Miyu
//
//  Created by Mira Estil on 1/29/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

internal final class LoginViewController: BaseViewController {
    
    private weak var fbManager = FirebaseUserManager.manager
    
    private weak var viewModel: LoginViewModel! {
        return LoginViewModel(presentingVC: self)
    }
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    // MARK: USER MANAGEMENT
  
    @IBAction func registerTapped(_ sender: Any) {
       viewModel.presentVC(vc: .RegisterViewController)
    }
    
    
    @IBAction func didLoginTapped(_ sender: Any) {
        
        let user = UserCredential(email: emailTextField.text!, password: passwordTextField.text!)
        
        fbManager?.login(user: user) {
            AppDelegate.shared.rootViewController.switchToMainScreen()
        }
    }
}
