//
//  InstantiatedViewControllers.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

enum PresentViewController: String {
    case HomepageViewController, RegisterViewController, UploadViewController
}

/// AppStoryboard enum provides all VCs and instantiates each by storyboard ID.
enum AppStoryboard: String {
    
    case HomepageViewController, RegisterViewController, ProfileViewController, UploadViewController, LoginViewController
    
    var instance: UIStoryboard {
        
        return UIStoryboard(name: self.rawValue, bundle: Bundle.main)
    }
    
    ///From: https://medium.com/@gurdeep060289/clean-code-for-multiple-storyboards-c64eb679dbf6
    ///TODO: Refactor
    func viewController<T: UIViewController>(viewControllerClass: T.Type, function: String = #function, line: Int = #line, file: String = #file) -> T {
        
        let storyboardID = (viewControllerClass as UIViewController.Type).storyboardID
        
        guard let scene = instance.instantiateViewController(withIdentifier: storyboardID) as? T else {
            
            fatalError("ViewController with identifier \(storyboardID), not found in \(self.rawValue) Storyboard.\nFile : \(file) \nLine Number : \(line) \nFunction : \(function)")
        }
        
        return scene
    }
    
    func initialViewController() -> UIViewController? {
        
        return instance.instantiateInitialViewController()
    }
}

// MARK: INSTANTIATING STORYBOARDS

class InstantiatedViewControllers {
    
    var uploadVC: UIViewController? {
        return UploadViewController.instantiate(fromAppStoryboard: .UploadViewController)
    }
    
    var registerVC: UIViewController? {
        return RegisterViewController.instantiate(fromAppStoryboard: .RegisterViewController)
    }
    
    var homeVC: UIViewController? {
        return HomepageViewController.instantiate(fromAppStoryboard: .HomepageViewController)
    }
    
    var profileVC: UIViewController? {
        return ProfileViewController.instantiate(fromAppStoryboard: .ProfileViewController)
    }
    
    var navController: UINavigationController? {
        guard let homeVC = homeVC else {
            return UINavigationController()
        }
        return UINavigationController(rootViewController: homeVC)
    }
    
    var tabBar: UITabBarController? {
        let tabBar = UITabBarController()
        guard let navController = navController,
            let profileVC = profileVC else {
                return tabBar
        }
        
        tabBar.setViewControllers([navController, profileVC], animated: true)
        return tabBar
    }
    
    init() {}
}

extension InstantiatedViewControllers {
    
    func presentDestinationVC(from presentingVC: UIViewController?, to vc: PresentViewController) {
        switch vc {
        case .HomepageViewController:
            guard let homeTabBar = self.tabBar else { return }
            presentingVC?.present(homeTabBar, animated: true, completion: nil)
        case .RegisterViewController:
            guard let registerVC = self.registerVC else { return }
            presentingVC?.present(registerVC, animated: true, completion: nil)
        case .UploadViewController:
            guard let uploadVC = self.uploadVC else { return }
            presentingVC?.present(uploadVC, animated: true, completion: nil)
        }
    }
}
