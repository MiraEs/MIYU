//
//  RegisterViewController.swift
//  Simi
//
//  Created by Mira Estil on 2/3/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

/// RegisterViewController initial build of User's profile before main home page.
internal final class RegisterViewController: BaseViewController {
    
    private var fbManager = FirebaseUserManager.manager
    private var viewModel: RegisterViewModel!
    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var firstNameLabel: UITextField!
    @IBOutlet weak var lastNameLabel: UITextField!
    @IBOutlet weak var emailLabel: UITextField!
    @IBOutlet weak var passwordLabel: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setup()
    }
    
    private func setup() {
        viewModel = RegisterViewModel(presentingViewController: self)
    }
    
    @IBAction func finishButtonTapped(_ sender: Any) {
        guard let email = emailLabel.text,
            let password = passwordLabel.text,
            let firstName = firstNameLabel.text,
            let lastName = lastNameLabel.text else {
                return
        }
        
        let userCredentials = UserCredential(email: email, password: password)
        let user = AppUser(firstName: firstName, lastName: lastName, email: email)
        
        fbManager.createUser(user: user, userCredentials: userCredentials) { [weak self] in
            self?.viewModel?.presentRootController()
        }
    }
}
