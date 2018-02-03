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
    
    var registerVC: UIViewController {
        return RegisterViewController.instantiate(fromAppStoryboard: .RegisterViewController)
    }
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
        setup()
    }
    
    // TODO: TESTING
    private func testing() {
        
    }
    
    // MARK: SETUP
    
    private func setup() {
        self.view.backgroundColor = UIColor(red:0.92, green:0.74, blue:0.74, alpha:1.0)
    }
    //MARK: REGISTER
    @IBAction func registerTapped(_ sender: Any) {
        present(registerVC, animated: true, completion: nil)
    }
    
    // MARK: LOGIN
    @IBAction func didLoginTapped(_ sender: Any) {
        
    }
}

extension LoginViewController: UITextFieldDelegate {
    
    func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
        //validate text here?
        return true
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        print(textField.text ?? "")
    }
    
    

}
