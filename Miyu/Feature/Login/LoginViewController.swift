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
    
    let firebaseManager = FirebaseUserManager.manage
    
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
    
    // TODO: TESTING
    private func createUser() {
        guard let email = emailTextField.text,
            let password = passwordTextField.text else {
                return
        }
        
        if isValidUser {
            Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
                if user != nil {
                    self.resetTextfields()
                } else {
                    print(error?.localizedDescription ?? "Unknown error")
                }
            })
            //present(homeVC!, animated: true, completion: nil)
        }
    }
    
    private func signIn() {
        guard let email = emailTextField.text,
            let password = passwordTextField.text else {
                return
        }
        
        Auth.auth().signIn(withEmail: email, password: password) { (user, error) in
            if user != nil {
                print(user?.email)
            } else {
                print(error.debugDescription)
            }
        }
    }
    
    private func signOut() {
        do {
            print("signing out \(String(describing: Auth.auth().currentUser?.email))")
            try Auth.auth().signOut()
        } catch let signOutError as NSError {
            print("Error signing out: %@", signOutError)
        }
    }
  
    @IBAction func registerTapped(_ sender: Any) {
        print("register tapped")
        //createUser()
        firebaseManager.doAction(firebase: .register, user: User(email: emailTextField.text!, password: passwordTextField.text))
        //present(registerVC!, animated: true, completion: nil)
    }
    
    @IBAction func signOutTapped(_ sender: Any) {
        print("signout tapped")
        firebaseManager.doAction(firebase: .signout, user: Auth.auth().currentUser)
        //signOut()
    }
    
    // MARK: LOGIN
    @IBAction func didLoginTapped(_ sender: Any) {
        print("login tapped")
        //signIn()
    }
}
