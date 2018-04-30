//
//  ProfileUserDataModel.swift
//  Miyu
//
//  Created by Mira Estil on 3/15/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import RealmSwift

class ProfileUserDataModel {
    
    private weak var fbSerivce = FirebaseSerivce.shared
    private weak var fbManager = FirebaseUserManager.manager
    private weak var store = DataStore.sharedInstance
    private weak var presentingViewController: UIViewController?
    
    init(_ presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
    }
    
    func setup(_ collectionView: UICollectionView) {
        collectionView.register(ContentCollectionViewCell.self, forCellWithReuseIdentifier: Constants.contentCollectionViewCell)
        collectionView.register(ContentTableViewCell.self, forCellWithReuseIdentifier: Constants.contentTableViewCell)
        collectionView.register(ContentFriendCell.self, forCellWithReuseIdentifier: Constants.contentFriendCell)
        collectionView.alwaysBounceHorizontal = true
    }
    
    func designSetup(_ image: UIImageView) {
        image.setRounded()
    }
    
    private func loadUserData(_ uid: String?, _ handler: @escaping (_ user: AppUser)->Void) {
        guard let uid = uid else { return }
//        fbManager?.getUserData(validUid, { (user) in
//            handler(user)
//        })
        fbSerivce?.getData(.user(uid: uid), AppUser.self, { (user, key) in
            user.keyUid = key
            handler(user)
        })
        
    }
    
    func loadData(_ isDiffOrigin: Bool, _ uid: String?, _ completion: @escaping (_ user: AppUser)->Void) {
        if isDiffOrigin {
            if let vUid = uid {
                self.store?.userPosts = uiRealm.objects(Post.self).filter("uid == %@", vUid)
                loadUserData(vUid) { (user) in
                    completion(user)
                }
            }
        } else {
            if let vUid = fbManager?.currentUser?.uid {
                self.store?.userPosts = uiRealm.objects(Post.self).filter("uid == %@", vUid)
                loadUserData(vUid) { (user) in
                    completion(user)
                }
            }
        }
    }
    
    func fetchFriends() {
        if (store?.friends.isEmpty)! {
            fbManager?.getFriends({ (user) in
                self.store?.friends.append(user)
            })
        }
    }
    
    func addFriend(_ uid: String) {
        fbManager?.addFriend(uid)
    }
    
    
    func resetFriendStorage() {
        self.store?.friends = [AppUser]()
    }
}
