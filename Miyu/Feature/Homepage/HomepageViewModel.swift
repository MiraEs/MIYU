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
    //var posts = [[String:String]]()
    
    init(_ presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
      //  self.posts = getPosts()
    }
    
    // MARK: UTILITY
    func setup(_ tableView: UITableView) {
        tableView.register(UINib(nibName: Constants.homeXib, bundle: nil),
                           forCellReuseIdentifier: Constants.homeCell)
    }
    
    func getPosts() -> [[String:String]] {
        guard let posts = fbManager?.getPosts() else { return [[:]] }
        return posts
    }
    
}
