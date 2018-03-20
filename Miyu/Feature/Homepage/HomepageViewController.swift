
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
    
    private weak var store = DataStore.sharedInstance
    private weak var storeManager = DataStoreManager()
    private weak var fbManager = FirebaseUserManager.manager
    private weak var currentUser: AppUser?
    private var viewModel: HomepageViewModel? {
        return HomepageViewModel(self)
    }
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        print("VIEW WILL APPEAR TABLE RELOAD")
        tableView.reloadData()
    }
    
    // MARK: SEGUE TO UPLOAD VC
    
    @IBAction func uploadContent(_ sender: Any) {
        print("upload content")
        self.viewModel?.presentVC(vc: .UploadViewController)
    }
    
    private func setup() {
        viewModel?.setup(tableView)
        loadDataFromDisk()
    }
    
    // MARK: MIRTEST
    func loadDataFromDisk() {
        let posts = DataStoreManager.loadAll(Post.self)
        if posts.isEmpty {
            print("disk is empty - fetching from netowrk")
            fetchPosts()
        } else {
            print("disk has information - pulling from disk")
            self.store?.posts = posts
            print(posts)
        }
    }
    
    // MARK: FETCH DATA
    private func fetchPosts() {
        let loadingIndicator = self.displaySpinner(onView: self.view)
        print("ADDED POST AND IS NOW UPDATED >>>>>>>>>>>>>  ")
        self.viewModel?.getPosts({ [weak self] (post) in
            self?.fetchPostUserData(post)
            DispatchQueue.main.async {
                self?.removeSpinner(spinner: loadingIndicator)
                self?.tableView.reloadData()
            }
        })
    }
    
    private func fetchPostUserData(_ post: Post) {
        fbManager?.getUserData(post.uid!, { [weak self] (user) in
            post.user = user
            self?.store?.posts.append(post)
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
        guard let count = store?.posts.count else { return 0 }
        return count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    
        let cell = tableView.dequeueReusableCell(withIdentifier: Constants.homeCell, for: indexPath) as! HomepageTableViewCell
        guard let allPosts = store?.posts else { return UITableViewCell() }
        
        let currentCell = allPosts[((allPosts.count)-1) - indexPath.row]

        guard let key = currentCell.key,
            let uid = currentCell.uid,
            let currentUid = fbManager?.currentUser?.uid,
            let user = currentCell.user,
            let photoUrl = user.photoUrl,
            let data = currentCell.data else { return UITableViewCell() }
        
        cell.post = currentCell
        cell.setupCell(uid)
        cell.setupTap(indexPath.row)
        fetchPhoto(data, photoUrl, cell)
        
        if uid != currentUid {
            cell.ratingView.didFinishTouchingCosmos = { rating in
                cell.ratingView.rating = rating
                cell.ratingUpdate(rating, key, uid)
                currentCell.rating = rating
            }
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell,
                   forRowAt indexPath: IndexPath) {
        cell.backgroundColor = UIColor.clear
    }
}

extension HomepageViewController: UIBarPositioningDelegate {
    func positionForBar(bar: UIBarPositioning) -> UIBarPosition {
        return .topAttached
    }
}
