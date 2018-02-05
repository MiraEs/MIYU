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
    
    var fbManager = FirebaseUserManager.manager
    
    private weak var viewModel: LoginViewModel! {
        return LoginViewModel(presentingVC: self)
    }
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    private func resetTextfields() {
        emailTextField.text = ""
        passwordTextField.text = ""
    }
  
    @IBAction func registerTapped(_ sender: Any) {
       viewModel.presentVC(vc: .registerVC)
    }
    
    @IBAction func signOutTapped(_ sender: Any) {
        fbManager.signOut()
    }
    
    // MARK: LOGIN
    @IBAction func didLoginTapped(_ sender: Any) {
        let user = User(email: emailTextField.text!, password: passwordTextField.text!)
        
        fbManager.login(user: user) { [weak self] in
            self?.viewModel.presentVC(vc: .homeVC)
        }
    }
}
