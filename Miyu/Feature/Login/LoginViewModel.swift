//
//  LoginViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import UIKit

enum PresentVC {
    case registerVC, homeVC
}

internal final class LoginViewModel {
    
    private weak var mainVC: UIViewController? {
        return HomepageViewController.instantiate(fromAppStoryboard: .HomepageViewController)
    }
    
    private weak var homeVC: UIViewController? {
        return HomepageViewController.instantiate(fromAppStoryboard: .HomepageViewController)
    }
    
    private weak var registerVC: UIViewController? {
        return RegisterViewController.instantiate(fromAppStoryboard: .RegisterViewController)
    }
    
    private weak var presentingVC: UIViewController?
    
    init(presentingVC: UIViewController) {
        self.presentingVC = presentingVC
    }

    func presentVC(vc: PresentVC) {
        switch vc {
        case .homeVC:
            guard let homeVC = homeVC else { return }
            presentingVC?.present(homeVC, animated: true, completion: nil)
        case .registerVC:
            guard let registerVC = registerVC else { return }
            presentingVC?.present(registerVC, animated: true, completion: nil)
        }
    }
    
}
