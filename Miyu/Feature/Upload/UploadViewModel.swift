//
//  UploadViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/9/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

internal final class UploadViewModel {
    
    var presentingViewController: UIViewController?
    private var fbManager = FirebaseUserManager.manager
    
    init(presentVc: UIViewController) {
        self.presentingViewController = presentVc
    }
    
    func showPicker() {
        let picker = UIImagePickerController()
        guard let presentingView = self.presentingViewController else { return }
        picker.delegate = presentingView as? UIImagePickerControllerDelegate & UINavigationControllerDelegate
        picker.allowsEditing = true
        presentingViewController?.present(picker, animated: true, completion: nil)
    }
    
    func uploadPic(with profileImage: UIImageView) {
        // current user uid will make key
        guard let key = Auth.auth().currentUser?.uid else { return }
        let imageName = NSUUID().uuidString
        let storageRefImages = Storage.storage().reference().child("images").child(key).child("\(imageName).png")
        //let storageRefVideos = Storage.storage().reference().child("videos").child(key).child("imageName")
        let userStorageRef = Storage.storage().reference().child("users").child(key).child("\(imageName).png")
        let storageRef = Storage.storage().reference().child("allContent").child("\(imageName).png")
        if let image = profileImage.image {
            let uploadData = UIImagePNGRepresentation(image)
            
            // Ref 1 - Images/user
            storageRefImages.putData(uploadData!, metadata: nil, completion: { (metadata, error) in
                if error != nil {
                    print(error!)
                }
                if let urlString = metadata?.downloadURL()?.absoluteString {
                    //self.uploadToDatabase(urlString)
                    self.fbManager.uploadToDatabase(urlString, .posts)
                }
            })
            
            // Ref 2 - User
            userStorageRef.putData(uploadData!, metadata: nil, completion: nil)
            
            // Ref 3 - Url/Userkey - all content with user key
            storageRef.putData(uploadData!, metadata: nil, completion: { (nil, error) in
                if error != nil {
                    print(error!)
                }
            })
        }
    }
}
