
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
    
    // MARK: FETCH POSTS
    private func fetchPosts() {
        self.viewModel?.getPosts({ [weak self] (post) in
            self?.allPosts.append(post)
            DispatchQueue.main.async {
                self?.tableView.reloadData()
            }
        })
    }
    
    private func fetchPhoto(_ urlString: String?, _ cell: HomepageTableViewCell) {
        if let urlString = urlString {
            cell.contentImage.loadCachedImage(urlString)
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
        
        print("USERRRRRRR INFOOO >> \(currentCell.user)")
        // Labels
        cell.nameLabel.text = currentCell.caption
        fetchPhoto(currentCell.data, cell)
        
        // Rating
        
        cell.setupTap(indexPath.row)
        // Image Interaction segue to profile
        
        cell.ratingView.rating = currentCell.rating!
        cell.ratingLabel.text = "\(currentCell.rating!)"
        
        cell.ratingView.didFinishTouchingCosmos = {
            rating in
            cell.ratingView.rating = rating
            cell.ratingUpdate(rating, key, uid)
            self.allPosts[indexPath.row].rating = rating
        }
        
        cell.commentCaptionLabel.text = "KEY \(String(describing: currentCell.key))"
        
        return cell
    }
}

extension HomepageViewController: UIBarPositioningDelegate {
    func positionForBar(bar: UIBarPositioning) -> UIBarPosition {
        return .topAttached
    }
}
