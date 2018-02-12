//
//  LoginViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import UIKit

internal final class LoginViewModel: InstantiatedViewControllers {

    private weak var presentingVC: UIViewController?
    
    init(presentingVC: UIViewController) {
        self.presentingVC = presentingVC
    }
 
    func presentVC(vc: PresentViewController) {
        presentDestinationVC(from: self.presentingVC, to: vc)
    }
}
