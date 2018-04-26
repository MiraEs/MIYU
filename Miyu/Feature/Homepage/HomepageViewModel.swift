//
//  HomepageViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import RealmSwift

internal final class HomepageViewModel: InstantiatedViewControllers {
    
    private weak var presentingViewController: UIViewController?
    private weak var fbManager = FirebaseUserManager.manager
    private weak var store = DataStore.sharedInstance
    
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
    
//    func getPosts(_ completion: @escaping (_ posts: Post)->Void) {
//        print("get postss CALLLED FROM HOMWPAGE VIEW MODEL >>>>>>")
//        fbManager?.getPosts(eventType: .childAdded, with: { (snapshot) in
//            do {
//                if JSONSerialization.isValidJSONObject(snapshot.value!) {
//                    let data = try JSONSerialization.data(withJSONObject: snapshot.value!, options: [])
//                    let post = try JSONDecoder().decode(Post.self, from: data)
//
//                    self.fbManager?.getUserData(post.uid!, { (user) in
//                        post.user = user
//                        post.key = snapshot.key
//                        post.writeToRealm()
//                        DispatchQueue.main.async {
//                            completion(post)
//                        }
//                    })
//                }
//            } catch {
//                print(error)
//            }
//        })
//    }

    func filterUserPostData() {
        if let uid = fbManager?.currentUser?.uid {
            self.store?.userPosts = uiRealm.objects(Post.self).filter("uid == %@", uid)
        }
    }
}
