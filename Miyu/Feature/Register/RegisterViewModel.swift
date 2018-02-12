//
//  RegisterViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/5/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import UIKit

/// RegisterViewModel handles info logic and segue to main home page after registration is successful.  Initializes root vcs for tab bar controller
internal final class RegisterViewModel: InstantiatedViewControllers {
    
    private weak var presentingViewController: UIViewController?
    
    init(presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
    }
    
    /// Presents main home page which is a tab bar controller.
    func presentRootController() {
        presentDestinationVC(from: self.presentingViewController, to: .HomepageViewController)
    }
    
}
