//
//  ProfileUserDataModel.swift
//  Miyu
//
//  Created by Mira Estil on 3/15/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class ProfileUserDataModel {
    
    private weak var fbManager = FirebaseUserManager.manager
    
    private weak var store = DataStore.sharedInstance
    
    private weak var storeManager = DataStoreManager()
    
    private var presentingViewController: UIViewController
    
    init(_ presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
    }
    
    func setup(_ collectionView: UICollectionView) {
        collectionView.register(ContentCollectionViewCell.self, forCellWithReuseIdentifier: Constants.contentCollectionViewCell)
        collectionView.register(ContentTableViewCell.self, forCellWithReuseIdentifier: Constants.contentTableViewCell)
        collectionView.alwaysBounceHorizontal = true
    }
    
    func designSetup(_ image: UIImageView) {
        image.setRounded()
    }
    
    func loadUserData(_ handler: @escaping (_ user: AppUser)->Void) {
        if let uid = fbManager?.currentUser?.uid {
            fbManager?.getUserData(uid, { (user) in
                handler(user)
            })
        }
    }
}
