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
    
    private var viewModel: ProfileUserDataModel? {
        return ProfileUserDataModel()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        
        customTabView.reloadData()
    }

    private func setup() {
        profileMenuBar.customDelegate = customTabView
        profileImage.setRounded()
        loadUserData()
    }

    private func loadUserData() {
        viewModel?.loadUserData({ [weak self] (user) in
            self?.setUserData(user)
        })
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


