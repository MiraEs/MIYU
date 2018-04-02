//
//  ProfileViewController.swift
//  Simi
//
//  Created by Mira Estil on 1/31/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import RealmSwift

class ProfileViewController: BaseViewController, CustomTabViewDelegate {
    
    var menuDelegate: MenuScrollDelegate!
    var lastContentOffset: CGFloat = 0
    var uid: String?
    var isDiffOrigin: Bool? = false
    private weak var fbManager = FirebaseUserManager.manager
    private weak var store = DataStore.sharedInstance
    private var viewModel: ProfileUserDataModel? {
        return ProfileUserDataModel(self)
    }

    @IBOutlet weak var profileImage: UIImageView! {
        didSet {
            viewModel?.designSetup(profileImage)
        }
    }
    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var userRating: UILabel!
    @IBOutlet weak var userAttribute: UILabel!
    @IBOutlet weak var profileMenuBar: ProfileMenuBar!
    @IBOutlet weak var contentCollectionView: UICollectionView! {
        didSet {
            contentCollectionView.delegate = self
            contentCollectionView.dataSource = self
            contentCollectionView.alwaysBounceHorizontal = false
            contentCollectionView.showsHorizontalScrollIndicator = false
        }
    }
    @IBOutlet weak var profileNavigationBar: UINavigationBar!
    @IBOutlet weak var dismissButton: UIBarButtonItem!
    @IBAction func dismissButtonTapped(_ sender: Any) {
        dismiss(animated: true, completion: nil)
        isDiffOrigin = false
    }
    @IBOutlet weak var addFriendButton: UIBarButtonItem!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(false)

        loadUserData()
        buttonStates()
    }
    
    func buttonStates() {
        if isDiffOrigin! {
            dismissButton.isEnabled = true
        } else {
            addFriendButton.isEnabled = false
            addFriendButton.tintColor = UIColor.clear
            dismissButton.isEnabled = false
            dismissButton.tintColor = UIColor.clear
        }
    }
    
    // MIRTEST
    @IBAction func addFriendButtonTapped(_ sender: Any) {
        print("adding friend")
        fbManager?.addFriend(uid)
    }
    
    
    func tappedThat(_ viewInt: Int) {
        switch viewInt {
        case 0:
            print("scroll to the left kdsmfkndsf")
            contentCollectionView.scrollToItem(at: IndexPath(item: 0, section: 0), at: .right, animated: true)
        case 1:
            print("scroll to the right skdjk")
            contentCollectionView.scrollToItem(at: IndexPath(item: 1, section: 0), at: .right, animated: true)
        case 2:
            contentCollectionView.scrollToItem(at: IndexPath(item: 2, section: 0), at: .right, animated: true)
        default:
            break
        }
    }
   
    private func setup() {
        viewModel?.setup(contentCollectionView)
        loadUserData()
        menuDelegate = profileMenuBar
        viewModel?.fetchFriends()
    }
    
    private func loadUserData() {
        if let uid = uid {
            print("uid is still good here >> \(uid)")
            viewModel?.loadUserData(uid, { [weak self] (user) in
                self?.setUserData(user)
                if (self?.store?.friends.contains(where: {$0.email == user.email}))! {
                    self?.addFriendButton.isEnabled = false
                    self?.addFriendButton.tintColor = UIColor.clear
                } else {
                    self?.addFriendButton.isEnabled = true
                }
            })
            viewModel?.loadUserPosts(uid, handler: {
                self.contentCollectionView.reloadData()
            })
        } else {
            viewModel?.loadUserData(fbManager?.currentUser?.uid, { [weak self] (user) in
                self?.setUserData(user)
            })
            viewModel?.loadUserPosts(fbManager?.currentUser?.uid, handler: {
                self.contentCollectionView.reloadData()
            })
        }
        
        //viewModel?.fetchFriends()
    }
    
    private func setUserData(_ user: AppUser) {
        guard let url = user.photoUrl else { return }
        
        profileImage.loadCachedImage(url)
        guard let firstName = user.firstName,
            let lastName = user.lastName,
            let rating = user.userRating.value else { return }
        userName.text = "\(firstName) \(lastName)"
        userRating.text = "\(rating)"
    }
}

extension ProfileViewController: UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return 3
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        if indexPath.row == 0 {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Constants.contentCollectionViewCell, for: indexPath) as! ContentCollectionViewCell
            profileMenuBar.customDelegate = self
            return cell
        } else if indexPath.row == 1 {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Constants.contentTableViewCell, for: indexPath) as! ContentTableViewCell
            profileMenuBar.customDelegate = self
            return cell
        } else {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Constants.contentFriendCell, for: indexPath) as! ContentFriendCell
            profileMenuBar.customDelegate = self
            return cell
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 0
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: collectionView.frame.width, height: collectionView.frame.height)
    }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let screenWidth = UIScreen.main.bounds.width
        if scrollView.contentOffset.x == screenWidth {
            menuDelegate.scrollToCell(IndexPath(item: 1, section: 0))
        } else if scrollView.contentOffset.x < screenWidth {
            menuDelegate.scrollToCell(IndexPath(item: 0, section: 0))
        } else if scrollView.contentOffset.x > screenWidth {
            menuDelegate.scrollToCell(IndexPath(item: 2, section: 0))
        }
    }
}




