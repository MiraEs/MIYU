//
//  UploadViewController.swift
//  Simi
//
//  Created by Mira Estil on 2/2/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class UploadViewController: UIViewController {

    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var rating: UILabel!
    
    
    @IBOutlet weak var captionTextView: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

    }

    @IBAction func editCaptionTapped(_ sender: Any) {
        print("edit caption tapped")
    }
    @IBAction func uploadImageTapped(_ sender: Any) {
        print("upload Image tapped")
    }
}
