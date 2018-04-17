//
//  UploadViewController.swift
//  Simi
//
//  Created by Mira Estil on 2/2/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import YPImagePicker

class UploadViewController: BaseViewController {
    
    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var rating: UILabel!
    @IBOutlet weak var captionTextView: UITextView!
    @IBOutlet weak var centerImage: UIButton!
    @IBOutlet weak var uploadButton: UIButton!
    @IBOutlet weak var editCaptionContainer: UIView!
    
    let picker = YPImagePicker()
    
    
    private weak var fbManager = FirebaseUserManager.manager
    
    private weak var viewModel: UploadViewModel! {
        return UploadViewModel(presentVc: self)
    }
    
    lazy var caption: String? = { [weak self] in
        return self?.captionTextView.text
        }()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.navigationBar.isHidden = false
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        setupCustomPicker()
        
    }
    
    func setupCustomPicker() {
        var config = YPImagePickerConfiguration()
        config.onlySquareImagesFromLibrary = false
        config.onlySquareImagesFromCamera = true
        config.libraryTargetImageSize = .original
        config.usesFrontCamera = true
        config.showsFilters = true
        config.screens = [.library, .photo, .video]
        config.startOnScreen = .library
        config.showsCrop = .rectangle(ratio: (16/9))
        config.hidesStatusBar = false
        //config.overlayView = myOverlayView
        YPImagePicker.setDefaultConfiguration(config)
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
        
        let left = UIBarButtonItem(title: "x", style: .plain, target: self, action: #selector(UploadViewController.dismissCamera))
        self.navigationItem.setLeftBarButton(left, animated: true)
    }
    
    @objc func dismissCamera() {
        self.dismiss(animated: true, completion: nil)
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
        //viewModel?.showPicker()
        picker.didSelectImage = { [unowned picker] img in
            // image picked
            print(img.size)
            //self.imageView.image = img
            self.uploadButton.setImage(img, for: .normal)
            picker.dismiss(animated: true, completion: nil)
        }
        
//        picker.didSelectVideo = { videoData, videoThumbnailImage in
//            // video picked
//            self.uploadButton.setImage(videoThumbnailImage, for: .normal)
//            picker.dismiss(animated: true, completion: nil)
//        }
//
//        picker.didCancel = {
//            print("Did Cancel")
//        }
        
        present(picker, animated: true, completion: nil)
    }
}
//
//extension UploadViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
//
//    func imagePickerController(_ picker: UIImagePickerController,
//                               didFinishPickingMediaWithInfo info: [String : Any]) {
//
//
//        let selectedImage = Image.setImage(info)
//
//        if let selectedImage = selectedImage {
//            uploadButton.setImage(selectedImage, for: .normal)
//        }
//
//        dismiss(animated: true, completion: nil)
//    }
//
//}

