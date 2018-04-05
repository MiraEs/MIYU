//
//  SplashViewController.swift
//  Miyu
//
//  Created by Mira Estil on 4/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class SplashViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        self.view.backgroundColor = UIColor.blue
        AppDelegate.shared.rootViewController.showLoginScreen()
    }
}
