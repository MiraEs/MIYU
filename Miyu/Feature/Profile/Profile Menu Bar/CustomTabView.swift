//
//  CustomTabView.swift
//  Miyu
//
//  Created by Mira Estil on 3/13/18.
//  Copyright © 2018 ME. All rights reserved.
//

//TODO: REFACTOR
import UIKit

class CustomTabView: UIView, CustomTabViewDelegate {
    
    lazy var tableView: UITableView = {
        let table = UITableView(frame: .zero, style: .plain)
        table.delegate = self
        table.dataSource = self
        return table
    }()
    
    lazy var collectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        let cv = UICollectionView(frame: .zero, collectionViewLayout: layout)
        cv.dataSource = self
        cv.delegate = self
        return cv
    }()
    
    lazy var viewModel: ProfileUserDataModel? = {
        return ProfileUserDataModel()
    }()
    
    private var userPosts = [Post]()
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        setupTableView()
        setupCollectionView()
        loadData()
        collectionView.isHidden = true
    }
    
    // MARK: SETUP
    func setupTableView() {
        addSubview(tableView)
        
        addConstraints(format: "H:|[v0]|", views: tableView)
        addConstraints(format: "V:|[v0]|", views: tableView)
        tableView.register(UINib(nibName: Constants.homeXib, bundle: nil),
                           forCellReuseIdentifier: Constants.homeCell)
    }
    
    func setupCollectionView() {
        collectionView.register(ProfileCollectionViewCell.self, forCellWithReuseIdentifier: Constants.customCollectionCell)
        addSubview(collectionView)
        
        addConstraints(format: "H:|[v0]|", views: collectionView)
        addConstraints(format: "V:|[v0]|", views: collectionView)
    }

    func loadData() {
        viewModel?.loadUserPosts({ [weak self] (post) in
            self?.userPosts.append(post)
            DispatchQueue.main.async {
                self?.tableView.reloadData()
                self?.collectionView.reloadData()
            }
        })
    }
    
    // MARK: FUNCTIONALITY
    func tappedThat(_ viewInt: Int) {
        switch viewInt {
        case 0:
            collectionView.isHidden = true
            tableView.isHidden = false
        case 1:
            collectionView.isHidden = false
            tableView.isHidden = true
        default:
            break
        }
    }
    
    private func fetchPhoto(_ contentUrlString: String?, _ profileUrlString: String?, _ cell: HomepageTableViewCell) {
        if let contentUrlString = contentUrlString,
            let profileUrlString = profileUrlString {
            cell.contentImage.loadCachedImage(contentUrlString)
            cell.profileImage.loadCachedImage(profileUrlString)
        }
    }
}

extension CustomTabView: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return userPosts.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: Constants.homeCell, for: indexPath) as! HomepageTableViewCell
        let currentCell = userPosts[(userPosts.count-1) - indexPath.row]
        
        let uid = currentCell.uid!
        
        // Setup
        cell.setupCell(uid)
        cell.post = currentCell
        
        // Image Interaction segue to profile
        fetchPhoto(currentCell.data, currentCell.user?.photoUrl, cell)
        
        return cell
    }
}

extension CustomTabView: UICollectionViewDataSource, UICollectionViewDelegateFlowLayout, UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return userPosts.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Constants.customCollectionCell, for: indexPath) as? ProfileCollectionViewCell
        
        let currentCell = userPosts[(userPosts.count-1) - indexPath.row]
        if let contentUrl = currentCell.data {
            cell?.imageView.loadCachedImage(contentUrl)
        }
        
        return cell!
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        print("TAPPED IT AGAIN \(indexPath)")
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 0
    }
}

// TODO: REFACTOR TO OWN file

class ProfileCollectionViewCell: BaseCell {
    let imageView: UIImageView = {
        let iv = UIImageView()
         iv.contentMode = .scaleAspectFit
        return iv
    }()
    
    override func setupViews() {
        super.setupViews()
        
        addSubview(imageView)
        addConstraints(format: "H:|[v0]|", views: imageView)
        addConstraints(format: "V:|[v0]|", views: imageView)
    }
}



