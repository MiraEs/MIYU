//
//  HomepageViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import UIKit

internal final class HomepageViewModel {
    
    private var presentingViewController: UIViewController
    
    private weak var fbManager = FirebaseUserManager.manager
    
    init(_ presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
    }
    
    // MARK: UTILITY
    func setup(_ tableView: UITableView) {
        tableView.register(UINib(nibName: Constants.homeXib, bundle: nil),
                           forCellReuseIdentifier: Constants.homeCell)
    }
    
    // MARK: FIREBASE
    func presentVC(vc: PresentViewController) {
        
    }
    
}
