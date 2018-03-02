//
//  HomepageViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

internal final class HomepageViewModel: InstantiatedViewControllers {
    
    private var presentingViewController: UIViewController

    private weak var fbManager = FirebaseUserManager.manager
    
    //var allPosts: [Post]?
    
    init(_ presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
        
    }
    
    // MARK: UTILITY
    func setup(_ tableView: UITableView) {
        tableView.register(UINib(nibName: Constants.homeXib, bundle: nil),
                           forCellReuseIdentifier: Constants.homeCell)
    }
    
    func presentVC(vc: PresentViewController) {
        presentDestinationVC(from: self.presentingViewController, to: vc)
    }
    
    // MARK: PREPARE DATA
    
    func getPosts(_ completion: @escaping (_ posts: Post)->Void) {
        fbManager?.getPosts(eventType: .childAdded, with: { (snapshot) in
            do {
                if JSONSerialization.isValidJSONObject(snapshot.value!) {
                    let data = try JSONSerialization.data(withJSONObject: snapshot.value!, options: [])
                    let post = try JSONDecoder().decode(Post.self, from: data)
            
                    self.getUserData(post.uid!, { (user) in
                        post.user = user
                        post.key = snapshot.key
                        completion(post)
                    })
                }
            } catch {
                print(error)
            }

        })
    }
    
    private func getUserData(_ uid: String, _ handler: @escaping (_ user: AppUser)->Void) {
        fbManager?.getUsers(eventType: .value, uid: uid, with: { (snapshot) in
            do {
                if JSONSerialization.isValidJSONObject(snapshot.value!) {
                    let data = try JSONSerialization.data(withJSONObject: snapshot.value!, options: [])
                    
                    let user = try JSONDecoder().decode(AppUser.self, from: data)
                    
                    handler(user)
                }
            } catch {
                print(error)
            }
        })
    }
}
