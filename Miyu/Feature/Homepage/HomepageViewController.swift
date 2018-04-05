
//
//  HomepageViewController.swift
//  Miyu
//
//  Created by Mira Estil on 1/29/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import RealmSwift

internal final class HomepageViewController: BaseViewController {
    
    private weak var fbManager = FirebaseUserManager.manager
    private weak var viewModel: HomepageViewModel? {
        return HomepageViewModel(self)
    }
    private var allPosts: Results<Post>!
    
    @IBOutlet weak var tableView: UITableView!
    
    @IBAction func singOutButtonTapped(_ sender: Any) {
        print("signing out")
        fbManager?.signOut {
            //self.viewModel?.presentVC(vc: .LoginViewController)
            self.removeFromParentViewController()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        print("REALM CONFIG >>>>>>>>>>>>>>>>>>>>>>>>> \(Realm.Configuration.defaultConfiguration.fileURL!)")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
    }
    
    private func setup() {
        viewModel?.setup(tableView)
        fetchPosts()
    }

    private func reloadData() {
        allPosts = uiRealm.objects(Post.self)
        viewModel?.filterUserPostData()
        self.tableView.reloadData()
    }
    
    // MARK: FETCH DATA
    private func fetchPosts() {
        let loadingIndicator = self.displaySpinner(onView: self.view)
        self.viewModel?.getPosts({ [weak self] (post) in
                self?.removeSpinner(spinner: loadingIndicator)
                self?.reloadData()
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
        if allPosts == nil {
            return 0
        } else {
            return allPosts.count
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    
        let cell = tableView.dequeueReusableCell(withIdentifier: Constants.homeCell, for: indexPath) as! HomepageTableViewCell
        let currentCell = allPosts[(allPosts.count-1) - indexPath.row]

        guard let key = currentCell.key,
            let uid = currentCell.uid,
            let currentUid = fbManager?.currentUser?.uid,
            let user = currentCell.user,
            let photoUrl = user.photoUrl,
            let data = currentCell.data else { return UITableViewCell() }
        
        cell.post = currentCell
        cell.presentingVc = self.navigationController
        cell.setupCell(uid)
        cell.setupTap(indexPath.row)
        fetchPhoto(data, photoUrl, cell)
        
        if uid != currentUid {
            cell.ratingView.didFinishTouchingCosmos = { rating in
                cell.ratingView.rating = rating
                cell.ratingUpdate(rating, key, uid)
                try! uiRealm.write {
                    currentCell.rating.value = rating
                }
            }
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell,
                   forRowAt indexPath: IndexPath) {
        cell.backgroundColor = UIColor.clear
    }
}
