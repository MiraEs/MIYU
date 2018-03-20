//
//  ProfileViewController.swift
//  Simi
//
//  Created by Mira Estil on 1/31/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

class ProfileViewController: BaseViewController {

    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var userRating: UILabel!
    @IBOutlet weak var userAttribute: UILabel!
    @IBOutlet weak var profileMenuBar: MenuBar!
    @IBOutlet weak var customTabView: CustomTabView!
    
    private weak var store = DataStore.sharedInstance
    private weak var storeManager = DataStoreManager()
    
    private var viewModel: ProfileUserDataModel? {
        return ProfileUserDataModel()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        print("PROFILE VIEW WILL APPEAR")
        customTabView.reloadData()
    }

    private func setup() {
        profileMenuBar.customDelegate = customTabView
        profileImage.setRounded()
        loadUserData()
        
        if (store?.userPosts.isEmpty)! {
            print("STORE USER POSTS IS EMPTY")
            loadUserPosts()
        } else {
            print("STORE USER POST COUNT \(store?.userPosts.count)")
            store?.userPosts = (storeManager?.loadPosts(store!, from: .userData))!
        }
    }
    
    private func loadUserData() {
        viewModel?.loadUserData({ [weak self] (user) in
            self?.setUserData(user)
        })
    }
    
    func loadUserPosts() {
        viewModel?.loadUserPosts({ [weak self] (post) in
            self?.store?.userPosts.append(post)
            DispatchQueue.main.async {
                self?.customTabView.collectionView.reloadData()
                self?.customTabView.tableView.reloadData()
            }
        })
        //DataStoreManager.save(self?.store?.userPosts, with: PathComponents.postData.rawValue)
        storeManager?.saveData((self.store?.userPosts)!, store: store!, pathComponent: .userData)
    }
    
    
    private func setUserData(_ user: AppUser) {
        guard let url = user.photoUrl else { return }
        
        profileImage.loadCachedImage(url)
        guard let firstName = user.firstName,
            let lastName = user.lastName,
            let rating = user.userRating else { return }
        userName.text = "\(firstName) \(lastName)"
        userRating.text = "\(rating)"
    }
}


