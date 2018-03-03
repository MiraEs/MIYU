
//
//  HomepageViewController.swift
//  Miyu
//
//  Created by Mira Estil on 1/29/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase

internal final class HomepageViewController: BaseViewController {
    
    private weak var fbManager = FirebaseUserManager.manager
    private weak var currentUser: AppUser?
    private var viewModel: HomepageViewModel? {
        return HomepageViewModel(self)
    }
    //private var allPosts = [Post]()
    private var allPosts = [Post]()
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setup()
    }
    
    // MARK: SEGUE TO UPLOAD VC
    
    @IBAction func uploadContent(_ sender: Any) {
        print("upload content")
        self.viewModel?.presentVC(vc: .UploadViewController)
    }
    
    private func setup() {
        viewModel?.setup(tableView)
        fetchPosts()
    }
    
    // MARK: FETCH DATA
    private func fetchPosts() {
        self.viewModel?.getPosts({ [weak self] (post) in
            self?.allPosts.append(post)
            DispatchQueue.main.async {
                self?.tableView.reloadData()
            }
        })
    }
    
    private func fetchPhoto(_ contentUrlString: String?, _ profileUrlString: String?, _ cell: HomepageTableViewCell) {
        if let contentUrlString = contentUrlString,
            let profileUrlString = profileUrlString {
            cell.contentImage.loadCachedImage(contentUrlString)
            cell.profileImage.loadCachedImage(profileUrlString)
        }
    }
    
}

extension HomepageViewController: UITableViewDelegate, UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return allPosts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    
        let cell = tableView.dequeueReusableCell(withIdentifier: Constants.homeCell, for: indexPath) as! HomepageTableViewCell
        let currentCell = allPosts[(allPosts.count-1) - indexPath.row]
        let key = currentCell.key!
        let uid = currentCell.uid!
        
        // Setup
        cell.setupCell(uid)
        
        // Labels
        cell.nameLabel.text = currentCell.user?.firstName
        
        // Image Interaction segue to profile
        fetchPhoto(currentCell.data, currentCell.user?.photoUrl, cell)
        cell.setupTap(indexPath.row)
        
        
        // Rating
        cell.ratingView.rating = currentCell.rating!
        cell.ratingLabel.text = "\(currentCell.rating!)"
        
        if fbManager?.currentUser?.uid != uid {
            cell.ratingView.didFinishTouchingCosmos = { [weak self] rating in
                cell.ratingView.rating = rating
                cell.ratingUpdate(rating, key, uid)
                self?.allPosts[indexPath.row].rating = rating
            }
        }
        
        return cell
    }
}

extension HomepageViewController: UIBarPositioningDelegate {
    func positionForBar(bar: UIBarPositioning) -> UIBarPosition {
        return .topAttached
    }
}
