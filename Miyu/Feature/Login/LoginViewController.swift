//
//  LoginViewController.swift
//  Miyu
//
//  Created by Mira Estil on 1/29/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import RealmSwift

internal final class LoginViewController: BaseViewController {
    
    private weak var fbManager = FirebaseUserManager.manager
    private weak var fbSerivce = FirebaseSerivce.shared
    private weak var store = DataStore.sharedInstance
    private weak var viewModel: LoginViewModel! {
        return LoginViewModel(presentingVC: self)
    }
    
    @IBOutlet weak var emailTextField: CustomTextField!
    @IBOutlet weak var passwordTextField: CustomTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        emailTextField.delegate = self
        passwordTextField.delegate = self
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
        
//        FirebaseUserService.login(user: user) { (uid) in
//            if let currentUser = uiRealm.objects(AppUser.self).filter("uid == %@", uid) {
//                store?.currentUser = currentUser
//            } else {
//                self.fbSerivce?.getData(.user(uid: uid), AppUser.self, { (appUser, key) in
//                    appUser.keyUid = key
//                })
//            }
//        }
    }
}

extension LoginViewController: UITextFieldDelegate {
    func textFieldDidBeginEditing(_ textField: UITextField) {
        textField.placeholder = nil
        textField.tintColor = UIColor(red:0.50, green:0.35, blue:0.62, alpha:1.0)
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        textField.tintColor = UIColor.white
    }
}
