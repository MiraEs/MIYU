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

class ProfileViewController: BaseViewController {

    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var userRating: UILabel!
    @IBOutlet weak var userAttribute: UILabel!
    @IBOutlet weak var profileMenuBar: MenuBar!
    //@IBOutlet weak var customTabView: CustomTabView!
    @IBOutlet weak var contentCollectionView: UICollectionView!
    
    let cellIdA = "cellIdA"
    let cellIdB = "cellIdB"
    
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

        contentCollectionView.reloadData()
    }

    private func setup() {
        contentCollectionView.delegate = self
        profileImage.setRounded()
        loadUserData()
        setupContentCollectionView()
    }
    
    private func setupContentCollectionView() {
        contentCollectionView.delegate = self
        contentCollectionView.dataSource = self
        contentCollectionView.register(ContentCollectionViewCell.self, forCellWithReuseIdentifier: cellIdA)
        contentCollectionView.register(ContentTableViewCell.self, forCellWithReuseIdentifier: cellIdB)
        contentCollectionView.alwaysBounceHorizontal = true
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
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: cellIdA, for: indexPath) as! ContentCollectionViewCell
        profileMenuBar.customDelegate = cell.view
        
            return cell
        } else {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: cellIdB, for: indexPath) as! ContentTableViewCell
            profileMenuBar.customDelegate = cell.view
            
            return cell
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: collectionView.frame.width, height: collectionView.frame.height)
    }
    
}

class ContentTableViewCell: BaseCell {
    
    lazy var view: CustomTabView = {
        let view = CustomTabView()
        return view
    }()
    
    override func setupViews() {
        super.setupViews()
        
        addSubview(view)
        addConstraints(format: "H:|[v0]|", views: view)
        addConstraints(format: "V:|[v0]|", views: view)
        
        view.setupTableView()
    }
}

class ContentCollectionViewCell: BaseCell {
    lazy var view: CustomTabView = {
        let view = CustomTabView()
        return view
    }()
    
    override func setupViews() {
         super.setupViews()
        
        addSubview(view)
        addConstraints(format: "H:|[v0]|", views: view)
        addConstraints(format: "V:|[v0]|", views: view)
        view.setupCollectionView()
    }
}




