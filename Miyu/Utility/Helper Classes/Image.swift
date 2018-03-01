//
//  Image.swift
//  Miyu
//
//  Created by Mira Estil on 2/28/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class Image {
    
    static func setImage(_ info: [String:Any]) -> UIImage? {
        var selectedImage: UIImage?
        if let editedImage = info["UIImagePickerControllerEditedImage"] as? UIImage {
            selectedImage = editedImage
        } else if let originalImage = info["UIImagePickerControllerOriginalImage"] as? UIImage {
            selectedImage = originalImage
        }
        
        return selectedImage
    }
    
    static func convertToPngData(with content: UIImage?) -> Data? {
        var data: Data?
        if let image = content {
            data = UIImagePNGRepresentation(image)
        }
        return data
    }
}

extension UIImage {
    func toPngData() -> Data? {
        return UIImagePNGRepresentation(self)
    }
}
