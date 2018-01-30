//
//  HomepageViewController.swift
//  Miyu
//
//  Created by Mira Estil on 1/29/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class HomepageViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

    }

    static func storyboardInstance() -> HomepageViewController? {
        let storyboard = UIStoryboard(name: "HomepageViewController", bundle: nil)
        return storyboard.instantiateViewController(withIdentifier: "HomepageViewController") as? HomepageViewController
    }

}
