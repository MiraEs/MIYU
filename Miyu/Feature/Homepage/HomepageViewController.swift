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
    //private var allPosts = [[String:AnyObject]]()
    private var allPosts = [Post]()
    
    private var fbManager = FirebaseUserManager.manager
    
    private weak var currentUser: AppUser?
    private var viewModel: HomepageViewModel? {
        return HomepageViewModel(self)
    }
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        viewModel?.setup(tableView)
        //fetchPosts()
        fetchPostsUsingModel()
   
    }
    
    // MARK: SEGUE TO UPLOAD VC
    
    @IBAction func uploadContent(_ sender: Any) {
        print("upload content")
        self.viewModel?.presentVC(vc: .UploadViewController)
    }
    
    // MARK: FETCH POSTS
    // TODO: REFACTOR FB MANAGER
//    private func fetchPosts() {
//        fbManager.fetchPosts(eventType: .childAdded) { (snapshot) in
//            if let dict = snapshot.value as? [String:AnyObject] {
//                self.allPosts.append(dict)
//                DispatchQueue.main.async {
//                    self.tableView.reloadData()
//                }
//            }
//        }
//    }
    
    private func fetchPostsUsingModel() {
        print("FETCHING STARTED")
        fbManager.fetchPosts(eventType: .childAdded) { (snapshot) in
            if let dict = snapshot.value as? [String:AnyObject] {
                if let validPost = Post.createPost(with: dict) {
                    self.allPosts.append(validPost)
                }
              
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            }
        }
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
        
        // Labels
        let currentCell = allPosts[indexPath.row]
        
        // NEW
        
        //cell.nameLabel.text = currentCell.caption
        //fetchPhoto(currentCell.data, cell)
        
        // TEST
        cell.nameLabel.text = currentCell.caption
        
        // Rating
        //let rating: Double = Double((indexPath as NSIndexPath).row) / 99 * 5
        //cell.update(rating, indexPath)

        cell.setupTap(indexPath.row)
        // Image Interaction segue to profile
        
        cell.ratingView.rating = currentCell.rating!
        cell.ratingLabel.text = "\(currentCell.rating!)"
        //cell.ratingUpdate(indexPath)
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print("did select row")
      
    }
}

extension HomepageViewController: UIBarPositioningDelegate {
    func positionForBar(bar: UIBarPositioning) -> UIBarPosition {
        return .topAttached
    }
}
