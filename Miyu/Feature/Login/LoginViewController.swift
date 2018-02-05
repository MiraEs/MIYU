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
    
    private weak var homeVC: UIViewController? {
        return HomepageViewController.instantiate(fromAppStoryboard: .HomepageViewController)
    }
    
    private weak var registerVC: UIViewController? {
        return RegisterViewController.instantiate(fromAppStoryboard: .RegisterViewController)
    }
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    private var isValidUser = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    // MARK: SETUP
    
    private func setup() {
        self.view.backgroundColor = UIColor(red:0.92, green:0.74, blue:0.74, alpha:1.0)
    }
    
    private func resetTextfields() {
        emailTextField.text = ""
        passwordTextField.text = ""
    }
  
    @IBAction func registerTapped(_ sender: Any) {
        fbManager.createUser(user: User(email: emailTextField.text!, password: passwordTextField.text!))
        //present(registerVC!, animated: true, completion: nil)
    }
    
    @IBAction func signOutTapped(_ sender: Any) {
        fbManager.signOut()
    }
    
    // MARK: LOGIN
    @IBAction func didLoginTapped(_ sender: Any) {
        fbManager.login(user: User(email: emailTextField.text!, password: passwordTextField.text!))
    }
}
