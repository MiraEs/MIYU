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
        }
    }
    
    var lastContentOffset: CGFloat = 0
    
    private var viewModel: ProfileUserDataModel? {
        return ProfileUserDataModel(self)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(false)
        print("PROFILE VIEW WILL APPEAR")
        print("realm object count >>>>>>>>>> \(DataStore.sharedInstance.userPosts.count)")
    }
    
    func tappedThat(_ viewInt: Int) {
        switch viewInt {
        case 0:
            print("scroll to the left kdsmfkndsf")
            contentCollectionView.selectItem(at: IndexPath(item: 0, section: 0), animated: true, scrollPosition: .right)
        case 1:
            print("scroll to the right skdjk")
            contentCollectionView.selectItem(at: IndexPath(item: 1, section: 0), animated: true, scrollPosition: .left)
        
        default:
            break
        }
    }
   
    private func setup() {
        viewModel?.setup(contentCollectionView)
        loadUserData()
        menuDelegate = profileMenuBar
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
            let rating = user.userRating.value else { return }
        userName.text = "\(firstName) \(lastName)"
        userRating.text = "\(rating)"
    }
}

extension ProfileViewController: UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return 2
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        if indexPath.row == 0 {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Constants.contentCollectionViewCell, for: indexPath) as! ContentCollectionViewCell
            profileMenuBar.customDelegate = self
            return cell
        } else {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Constants.contentTableViewCell, for: indexPath) as! ContentTableViewCell
            profileMenuBar.customDelegate = self
            return cell
        }
    }
    
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: collectionView.frame.width, height: collectionView.frame.height)
    }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if (self.lastContentOffset < scrollView.contentOffset.x) {
            print("dragged left <<<<<<<<<")
            menuDelegate.scrollToCell(IndexPath(item: 1, section: 0))
            
        } else if (self.lastContentOffset > scrollView.contentOffset.x) {
            print("dragged right >>>>>>>>>")
            menuDelegate.scrollToCell(IndexPath(item: 0, section: 0))
        }
    }
    
    func scrollViewWillBeginDragging(_ scrollView: UIScrollView) {
        self.lastContentOffset = scrollView.contentOffset.x
    }
}




