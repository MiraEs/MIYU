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
    
    private weak var fbManager = FirebaseUserManager.manager
    private weak var viewModel: RegisterViewModel! {
        return RegisterViewModel(presentingViewController: self)
    }
    @IBOutlet weak var profileImage: UIImageView! {
        didSet {
            profileImage.isUserInteractionEnabled = true
        }
    }
    @IBOutlet weak var firstNameLabel: UITextField!
    @IBOutlet weak var lastNameLabel: UITextField!
    @IBOutlet weak var emailLabel: UITextField!
    @IBOutlet weak var passwordLabel: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    private func setup() {
        let profileImageTapped = UITapGestureRecognizer(target: self, action: #selector(uploadProfileImage))
        profileImage.addGestureRecognizer(profileImageTapped)
    }
    
    @IBAction func backButtonTapped(_ sender: Any) {
        self.dismiss(animated: true, completion: nil)
    }
    
    @IBAction func finishButtonTapped(_ sender: Any) {
        guard let email = emailLabel.text,
            let password = passwordLabel.text,
            let firstName = firstNameLabel.text,
            let lastName = lastNameLabel.text,
            let profileImage = profileImage.image else {
                return
        }
        
        let userCredentials = UserCredential(email: email, password: password)
        let user = AppUser(firstName: firstName, lastName: lastName, email: email)
        
        fbManager?.createUser(appUser: user, userCredentials: userCredentials, profileImage: profileImage) { [weak self] in
            //print("new user>>> \(user.firstName)")
            self?.viewModel?.presentRootController()
        }
    }

    @objc func uploadProfileImage() {
        print("TAPPED THAT")
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.allowsEditing = true
        self.present(picker, animated: true, completion: nil)
    }
}

extension RegisterViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        
        let selectedImage = Image.setImage(info)
        
        if let selectedImage = selectedImage {
            profileImage.image = selectedImage
        }
        
        dismiss(animated: true, completion: nil)
    }
}

