//
//  UploadViewController.swift
//  Simi
//
//  Created by Mira Estil on 2/2/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

class UploadViewController: UIViewController {

    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var rating: UILabel!
    @IBOutlet weak var captionTextView: UITextView!
    @IBOutlet weak var centerImage: UIButton!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    @IBAction func editCaptionTapped(_ sender: Any) {
        print("edit caption tapped")
    }
    
    @IBAction func uploadContent(_ sender: Any) {
        print("upload pic to storage")
        uploadPic()
    }
    
    @IBAction func uploadImageTapped(_ sender: Any) {
        print("upload Image tapped")
        showPicker()
    }
    
    // MARK: FIREBASE STORAGE
    
    private func uploadPic() {
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
                    print(error?.localizedDescription)
                }
                if let urlString = metadata?.downloadURL()?.absoluteString {
                    self.uploadToDatabase(urlString)
                }
            })
            
            // Ref 2 - User
            userStorageRef.putData(uploadData!, metadata: nil, completion: nil)
            
            // Ref 3 - Url/Userkey - all content with user key
            storageRef.putData(uploadData!, metadata: nil, completion: { (nil, error) in
                if error != nil {
                    print(error?.localizedDescription)
                }
            })
        }
    }
    
    private func uploadToDatabase(_ contentUrl: String) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        
        // Currently just updating to "posts"
        let ref = Database.database().reference()
        let key = ref.child("posts").childByAutoId().key
        let post: [String: Any] = [
            "caption": "caption1",
            "data" : contentUrl
        ]
        
        let childUpdates = ["/posts/\(key)": post,
                            "/user-posts/\(uid)/\(key)/": post]
        ref.updateChildValues(childUpdates)
        print("update to database")
    }
    
    private func showPicker() {
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.allowsEditing = true
        present(picker, animated: true, completion: nil)
    }
    
    
}

extension UploadViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        
        var selectedImage: UIImage?
        
        if let editedImage = info["UIImagePickerControllerEditedImage"] as? UIImage {
            selectedImage = editedImage
        } else if let originalImage = info["UIImagePickerControllerOriginalImage"] as? UIImage {
            selectedImage = originalImage
        }
        
        if let selectedImage = selectedImage {
            profileImage.image = selectedImage
        }
        
        dismiss(animated: true, completion: nil)
    }
    
    
}

