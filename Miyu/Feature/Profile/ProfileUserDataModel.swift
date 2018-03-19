//
//  ProfileUserDataModel.swift
//  Miyu
//
//  Created by Mira Estil on 3/15/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

class ProfileUserDataModel {
    
    private weak var fbManager = FirebaseUserManager.manager
    
    private weak var store = DataStore.sharedInstance
    
    private weak var storeManager = DataStoreManager()
    
    init() {}
    
    func loadUserData(_ handler: @escaping (_ user: AppUser)->Void) {
        if let uid = fbManager?.currentUser?.uid {
            fbManager?.getUserData(uid, { (user) in
                handler(user)
            })
        }
    }
    
    func loadUserPosts(_ completion: @escaping (_ post: Post)->Void) {
        guard let uid = fbManager?.currentUser?.uid else { return }
        
        fbManager?.getUserPosts(uid: uid, eventType: .value, with: { (post) in
            completion(post)
        })
    }
}
