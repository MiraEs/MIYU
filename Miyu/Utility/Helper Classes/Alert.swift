//
//  Alert.swift
//  Miyu
//
//  Created by Mira Estil on 3/8/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

struct Alert {
//    let title: String
//    let message: String
//    let style: UIAlertControllerStyle
//    let loadingIndicator = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50))
    
    func showLoadingAlert(title: String, message: String, style: UIAlertControllerStyle) {
        let loadingIndicator = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50))
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = .gray
        loadingIndicator.startAnimating()
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: style)
        alert.view.addSubview(loadingIndicator)
        //present(alert, animated: true, completion: nil)
    }
}

//extension UIViewController {
//    func showLoadingAlert() {
//        let loadingIndicator = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50))
//        loadingIndicator.hidesWhenStopped = true
//        loadingIndicator.activityIndicatorViewStyle = .gray
//        loadingIndicator.startAnimating()
//
//        let alert = UIAlertController(title: nil, message: "Loading...", preferredStyle: .alert)
//        alert.view.addSubview(loadingIndicator)
//        self.present(alert, animated: true, completion: nil)
//    }
//}
//
//extension UIAlertController {
//    func dismissAlert() {
//        self.dismiss(animated: true, completion: nil)
//    }
// }



