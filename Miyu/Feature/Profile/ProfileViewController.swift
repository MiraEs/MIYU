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
    
    private var viewModel: ProfileUserDataModel? {
        return ProfileUserDataModel()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
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
        
        userName.text = "\(String(describing: user.firstName)) \(String(describing: user.lastName))"
        
        userRating.text = "\(String(describing: user.userRating))"
        
    }
}


