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
    private weak var viewModel: ProfileUserDataModel? {
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
    @IBOutlet weak var profileContentCollectionView: UICollectionView! {
        didSet {
            profileContentCollectionView.delegate = self
            profileContentCollectionView.dataSource = self
            profileContentCollectionView.alwaysBounceHorizontal = false
            profileContentCollectionView.showsHorizontalScrollIndicator = false
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(false)

        loadData()
        buttonStates()
    }
    
    func buttonStates() {
        if isDiffOrigin! {
            self.navigationItem.rightBarButtonItem?.isEnabled = true
        } else {
            self.navigationItem.rightBarButtonItem?.isEnabled = false
            self.navigationItem.rightBarButtonItem?.tintColor = UIColor.clear
        }
    }
    
    // MIRTEST
    @objc func addFriendButtonTapped() {
        print("adding friend")
        viewModel?.addFriend(uid!)
    }
    
    
    func tappedThat(_ viewInt: Int) {
        switch viewInt {
        case 0:
            profileContentCollectionView.scrollToItem(at: IndexPath(item: 0, section: 0), at: .right, animated: true)
        case 1:
            profileContentCollectionView.scrollToItem(at: IndexPath(item: 1, section: 0), at: .right, animated: true)
        case 2:
            profileContentCollectionView.scrollToItem(at: IndexPath(item: 2, section: 0), at: .right, animated: true)
        default:
            break
        }
    }
   
    private func setup() {
        viewModel?.setup(profileContentCollectionView)
        loadData()
        menuDelegate = profileMenuBar
        viewModel?.fetchFriends()
        
        self.navigationItem.title = "YOU"
        let right = UIBarButtonItem(image: UIImage(named: "addFriend"), style: .plain, target: self, action: #selector(self.addFriendButtonTapped))
        self.navigationItem.setRightBarButton(right, animated: true)
    }
    
    private func loadData() {
        viewModel?.loadData(isDiffOrigin!, uid, { [weak self] (user) in
            self?.setUserData(user)
            self?.profileContentCollectionView.reloadData()
        })
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
            cell.presentingVc = self.navigationController
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
