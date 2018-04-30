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
    @IBOutlet weak var captionTextView: UITextView! {
        didSet {
            captionTextView.keyboardAppearance = .dark
        }
    }
    @IBOutlet weak var centerImage: UIButton!
    @IBOutlet weak var uploadButton: UIButton!
    @IBOutlet weak var editCaptionContainer: UIView!
    
    let picker = YPImagePicker()
    
    
    private weak var fbManager = FirebaseUserManager.manager
    private weak var fbService = FirebaseSerivce.shared
    
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
        config.showsCrop = .rectangle(ratio: (1/1))
        config.hidesStatusBar = false
        //config.overlayView = myOverlayView®
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
        
        guard let photo = centerImage.imageView,
            let caption = caption else { return }
        
        fbService?.uploadPost(.posts, FbChildPaths.posts, photo, caption, {
            print("upload complete")
            self.dismiss(animated: true, completion: nil)
        })
    }
    
    @IBAction func uploadImageTapped(_ sender: Any) {
        print("upload Image tapped")
        
        present(picker, animated: true, completion: nil)
        
        picker.didSelectImage = { [unowned picker] img in
            // image picked
            print(img.size)
            
            self.uploadButton.setImage(img, for: .normal)
            picker.dismiss(animated: true, completion: nil)
        }
//
//        picker.didSelectVideo = { videoData, videoThumbnailImage in
//            // video picked
//            self.uploadButton.setImage(videoThumbnailImage, for: .normal)
//            picker.dismiss(animated: true, completion: nil)
//        }
//
        picker.didCancel = {
            print("Did Cancel")
        }
    }
}

