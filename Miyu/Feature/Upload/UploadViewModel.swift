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
}
