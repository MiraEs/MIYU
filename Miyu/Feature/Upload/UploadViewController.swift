//
//  UploadViewController.swift
//  Simi
//
//  Created by Mira Estil on 2/2/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

class UploadViewController: BaseViewController {

    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var rating: UILabel!
    @IBOutlet weak var captionTextView: UITextView!
    @IBOutlet weak var centerImage: UIButton!
    
    private weak var fbManager = FirebaseUserManager.manager
    
    private weak var viewModel: UploadViewModel! {
        return UploadViewModel(presentVc: self)
    }
    
    lazy var caption: String? = { [weak self] in
        return self?.captionTextView.text
    }()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func editCaptionTapped(_ sender: Any) {
        print("edit caption tapped")
    }
    
    @IBAction func uploadContent(_ sender: Any) {
        print("upload pic to storage")
        fbManager?.uploadContentToStorage(with: profileImage, to: .posts, caption!, completionHandler: { [weak self] in
            self?.dismiss(animated: true, completion: nil)
        })
    }
    
    @IBAction func uploadImageTapped(_ sender: Any) {
        print("upload Image tapped")
        viewModel?.showPicker()
    }
}

extension UploadViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {

        
        let selectedImage = Image.setImage(info)
        
        if let selectedImage = selectedImage {
            profileImage.image = selectedImage
        }
        
        dismiss(animated: true, completion: nil)
    }
}

