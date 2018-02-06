//
//  RegisterViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/5/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import UIKit

internal final class RegisterViewModel {
    private weak var homeVC: UIViewController? { return  HomepageViewController.instantiate(fromAppStoryboard: .HomepageViewController)
    }
    
    private weak var profileVC: UIViewController? { return ProfileViewController.instantiate(fromAppStoryboard: .ProfileViewController)
    }
    
    private weak var navController: UINavigationController? {
        guard let homeVC = homeVC else { return UINavigationController() }
        return UINavigationController(rootViewController: homeVC)
    }

    private weak var tabBar: UITabBarController? {
        let tabBar = UITabBarController()
        guard let navController = navController,
            let profileVC = profileVC else {
                return tabBar
        }
        tabBar.setViewControllers([navController, profileVC], animated: true)
        return tabBar
    }
    
    private var presentingViewController: UIViewController?
    
    init(presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
    }
    
    func presentRootController() {
        guard let tabBar = tabBar else {
            return
        }
        presentingViewController?.present(tabBar, animated: true, completion: nil)
    }
    

}
