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

    //@IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var userRating: UILabel!
    @IBOutlet weak var userAttribute: UILabel!
    
    @IBOutlet weak var profileMenuBar: MenuBar!
    
    @IBOutlet weak var customTabView: CustomTabView!
    
    private var userPosts = [Post]()
    private weak var fbManager = FirebaseUserManager.manager
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setup()
        loadUserData()
        
        //OMG DELEGATION WORKING YAY
        profileMenuBar.customDelegate = customTabView
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        loadUserData()
    }

    private func setup() {
//        tableView.register(UINib(nibName: Constants.profileXib, bundle: nil),
//                           forCellReuseIdentifier: Constants.profileCell)
//
        profileImage.setRounded()
    }
    
    private func loadUserData() {
        if let uid = fbManager?.currentUser?.uid {
            fbManager?.getUserData(uid, { [weak self] (user) in
                self?.setUserData(user)
                self?.loadUserPosts(user)
            })
        }
    }
    
    private func setUserData(_ user: AppUser) {
        guard let url = user.photoUrl else { return }
        profileImage.loadCachedImage(url)
        
        userName.text = "\(String(describing: user.firstName)) \(String(describing: user.lastName))"
        
        userRating.text = "\(String(describing: user.userRating))"
        
    }
    
    private func loadUserPosts(_ user: AppUser) {
        guard let uid = fbManager?.currentUser?.uid else { return }
        fbManager?.getUserPosts(uid: uid, eventType: .value, with: { (post) in
            self.userPosts.append(post)
//            DispatchQueue.main.async {
//                self.tableView.reloadData()
//            }
        })
    }
}

//extension ProfileViewController: UITableViewDelegate, UITableViewDataSource {
//
//    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
//        //return userPosts.count
//        return 3
//    }
//
//    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
//        let cell = tableView.dequeueReusableCell(withIdentifier: Constants.profileCell, for: indexPath) as! ProfileTableViewCell
//        cell.textLabel?.text = "LALALAL"
//        return cell
//    }
//}

