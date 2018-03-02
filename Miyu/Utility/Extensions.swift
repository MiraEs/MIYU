//
//  Extensions.swift
//  Miyu
//
//  Created by Mira Estil on 2/5/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

// MARK: UIVIewController

extension UIViewController {
    
    class var storyboardID: String {
        return "\(self)"
    }
    
    static func instantiate(fromAppStoryboard appStoryboard: AppStoryboard) -> Self {
        return appStoryboard.viewController(viewControllerClass: self)
    }
}

extension UIViewController {
    func hideKeyboardWhenTap() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
}

// MARK: UIImageView

/// UIImageView extension for cacheing images
// TODO: Capture video content as well
let imageCache = NSCache<AnyObject, AnyObject>()
extension UIImageView {
    
    func loadCachedImage(_ urlString: String) {
        let url = URL(string: urlString)
        if let cachedImage = imageCache.object(forKey: urlString as AnyObject) {
            self.image = cachedImage as? UIImage
            return
        }
        
        URLSession.shared.dataTask(with: url!, completionHandler: { (data, response, error) in
            if error != nil {
                print(error!)
            }
            DispatchQueue.main.async {
                if let downloadedImage = UIImage(data: data!) {
                    imageCache.setObject(downloadedImage, forKey: urlString as AnyObject)
                    self.image = downloadedImage
                }
                
                self.image = UIImage(data: data!)
            }
        }).resume()
    }
}

// MARK: ENCODABLE

/// Needed for object -> Json ready data for firebase - 'Codable' isn't extendable.
/// Discussion: https://stackoverflow.com/questions/46597624/can-swift-convert-a-class-struct-data-into-dictionary
/// More Info on Decodable/Codable: https://www.raywenderlich.com/172145/encoding-decoding-and-serialization-in-swift-4
extension Encodable {
    var dictionary: [String: Any]? {
        guard let data = try? JSONEncoder().encode(self) else { return nil }
        return (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)).flatMap { $0 as? [String: Any] }
    }
}






