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
    
    // TODO: TESTING
    private func testing(_ email: String) {
        Auth.auth().createUser(withEmail: email, password: "chesse", completion: nil)
    }
    
    // MARK: SETUP
    
    private func setup() {
        self.view.backgroundColor = UIColor(red:0.92, green:0.74, blue:0.74, alpha:1.0)
    }
    //MARK: REGISTER
    @IBAction func registerTapped(_ sender: Any) {
        present(registerVC!, animated: true, completion: nil)
    }
    
    // MARK: LOGIN
    @IBAction func didLoginTapped(_ sender: Any) {
        guard let email = emailTextField.text,
            let password = passwordTextField.text else {
                return
        }
        
        if isValidUser {
            Auth.auth().createUser(withEmail: email, password: password, completion: nil)
            present(homeVC!, animated: true, completion: nil)
        }
    }
}
