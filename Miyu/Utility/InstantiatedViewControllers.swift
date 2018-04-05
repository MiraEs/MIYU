//
//  InstantiatedViewControllers.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

enum PresentViewController: String {
    case HomepageViewController, RegisterViewController, UploadViewController, ProfileViewController, LoginViewController
}

/// AppStoryboard enum provides all VCs and instantiates each by storyboard ID.
enum AppStoryboard: String {
    
    case HomepageViewController, RegisterViewController, ProfileViewController, UploadViewController, LoginViewController
    
    var instance: UIStoryboard {
        return UIStoryboard(name: self.rawValue, bundle: Bundle.main)
    }
    
    ///From: https://medium.com/@gurdeep060289/clean-code-for-multiple-storyboards-c64eb679dbf6
    ///TODO: Refactor
    func viewController<T: UIViewController>(viewControllerClass: T.Type,
                                             function: String = #function, line: Int = #line,
                                             file: String = #file) -> T {
        
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
    
    var loginVC: UIViewController? {
        return LoginViewController.instantiate(fromAppStoryboard: .LoginViewController)
    }
    
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
        guard let homeVC = homeVC,
            let profileVC = profileVC,
            let uploadVC = uploadVC else {
                return tabBar
        }
        
        tabBar.setViewControllers([homeVC, uploadVC, profileVC].map({UINavigationController(rootViewController: $0)}), animated: true)
        tabBar.tabBar.items?[0].image = UIImage(named: "burger")
        tabBar.tabBar.items?[1].image = UIImage(named: "burger")
        tabBar.tabBar.items?[2].image = UIImage(named: "burger")
        return tabBar
    }
    
    init() {}
    
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
}

extension InstantiatedViewControllers {
    
    func presentDestinationVC(from presentingVC: UIViewController?, to vc: PresentViewController) {
        switch vc {
        case .HomepageViewController:
            guard let mainBar = self.tabBar else { return }
            appDelegate.window?.rootViewController = mainBar
            appDelegate.window?.makeKeyAndVisible()
        case .RegisterViewController:
            guard let registerVC = self.registerVC else { return }
            presentingVC?.present(registerVC, animated: true, completion: nil)
        case .UploadViewController:
            guard let uploadVC = self.uploadVC else { return }
            presentingVC?.present(uploadVC, animated: true, completion: nil)
        case .ProfileViewController:
            guard let profileVC = self.profileVC else { return }
            presentingVC?.present(profileVC, animated: true, completion: nil)
        case .LoginViewController:
            guard let loginVC = self.loginVC else { return }
            appDelegate.window?.rootViewController = loginVC
            appDelegate.window?.makeKeyAndVisible()
//            presentingVC?.present(loginVC, animated: true, completion: nil)
        }
    }
       
}
