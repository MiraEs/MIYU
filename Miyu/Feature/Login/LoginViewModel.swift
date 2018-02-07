//
//  LoginViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import UIKit

enum PresentViewController {
    case HomepageViewController, RegisterViewController
}

internal final class LoginViewModel: InstantiatedViewControllers {

    private weak var presentingVC: UIViewController?
    
    init(presentingVC: UIViewController) {
        self.presentingVC = presentingVC
    }

    func presentVC(vc: PresentViewController) {
        switch vc {
        case .HomepageViewController:
            guard let homeTabBar = self.tabBar else { return }
            presentingVC?.present(homeTabBar, animated: true, completion: nil)
        case .RegisterViewController:
            guard let registerVC = self.registerVC else { return }
            presentingVC?.present(registerVC, animated: true, completion: nil)
        }
    }
}
