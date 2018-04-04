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
    @IBOutlet weak var uploadButton: UIButton!
    @IBOutlet weak var editCaptionContainer: UIView!
    
    
    private weak var fbManager = FirebaseUserManager.manager
    
    private weak var viewModel: UploadViewModel! {
        return UploadViewModel(presentVc: self)
    }
    
    lazy var caption: String? = { [weak self] in
        return self?.captionTextView.text
        }()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    // MARK: DESIGN & SETUP
    
    private func setup() {
        editCaptionContainer.layer.borderWidth = 1
        editCaptionContainer.layer.borderColor = UIColor.black.cgColor
        
        profileImage.setRounded()
        rating.mediumFont()
        name.largeFont()
        
        self.navigationItem.title = "UPLOAD"
        let right = UIBarButtonItem(title: "upload", style: .plain, target: self, action: #selector(UploadViewController.uploadContent))
        self.navigationItem.setRightBarButton(right, animated: true)
    }
    
    @IBAction func editCaptionTapped(_ sender: Any) {
        print("edit caption tapped")
    }
    
    @objc func uploadContent() {
        print("upload pic to storage")
        guard let imageView = centerImage.imageView else { return }
        fbManager?.uploadContentToStorage(with: imageView,
                                          to: .posts, caption!,
                                          completionHandler: {
                                            print("upload complete")
        })
    }
    
    @IBAction func uploadImageTapped(_ sender: Any) {
        print("upload Image tapped")
        viewModel?.showPicker()
    }
}

extension UploadViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController,
                               didFinishPickingMediaWithInfo info: [String : Any]) {
        
        
        let selectedImage = Image.setImage(info)
        
        if let selectedImage = selectedImage {
            uploadButton.setImage(selectedImage, for: .normal)
        }
        
        dismiss(animated: true, completion: nil)
    }
}

