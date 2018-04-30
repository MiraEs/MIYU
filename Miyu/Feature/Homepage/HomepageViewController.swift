
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
import YPImagePicker

internal final class HomepageViewController: BaseViewController {
    
    private weak var fbService = FirebaseSerivce.shared
    private weak var fbManager = FirebaseUserManager.manager
    private weak var viewModel: HomepageViewModel? {
        return HomepageViewModel(self)
    }
    private var allPosts: Results<Post>!
    private var ratedUsers: Results<AppUser>!
    
    private var currentCellRating = ""
    
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    @IBOutlet weak var tableView: UITableView!
    
    @IBAction func singOutButtonTapped(_ sender: Any) {
        fbManager?.signOut {
            AppDelegate.shared.rootViewController.switchToLogout()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //print("CURRENT USER INFO YAYY>>>>>>>>>>>> \(String(describing: fbManager?.currentUser?.firstName))")
        
        self.tabBarController?.delegate = self
        
        setup()
        print("REALM CONFIG >>>>>>>>>>>>>>>>>>>>>>>>> \(Realm.Configuration.defaultConfiguration.fileURL!)")
        activityBarButton()
        setupCustomPicker()
        //fbManager?.getWhoRatedUsers()
    }
    
    let picker = YPImagePicker()
    
    //mirtest
    func setupCustomPicker() {
        var config = YPImagePickerConfiguration()
        config.onlySquareImagesFromLibrary = false
        config.onlySquareImagesFromCamera = true
        config.libraryTargetImageSize = .original
        config.usesFrontCamera = true
        config.showsFilters = true
        config.screens = [.library, .photo, .video]
        config.startOnScreen = .library
        config.showsCrop = .rectangle(ratio: (1/1))
        config.hidesStatusBar = false
        //config.overlayView = myOverlayView
        YPImagePicker.setDefaultConfiguration(config)
    }
    
    func activityBarButton() {
        let left = UIBarButtonItem(image: UIImage(named: "burger"), style: .plain, target: self, action: #selector(self.presentActivityViews))
        left.title = "20"
        self.navigationItem.setLeftBarButton(left, animated: true)
    }
    
    @objc func presentActivityViews() {
        print("present recent ratings")
        viewModel?.presentVC(vc: .ActivityRatingViewController)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
    }
    
    private func setup() {
        viewModel?.setup(tableView)
        
        if allPosts == nil {
            self.viewModel?.getPosts(completionHandler: {
                self.reloadData()
            })
        }
    }
    
    private func reloadData() {
        allPosts = uiRealm.objects(Post.self)
        tableView.reloadData()
        viewModel?.filterUserPostData()
        
        //mirtest
        //ratedUsers = uiRealm.object(ofType: AppUser.self, forPrimaryKey: "email")
    }
    
    
    private func fetchPhoto(_ contentUrlString: String?, _ profileUrlString: String?, _ cell: HomepageTableViewCell) {
        let loadingIndicator = self.displaySpinner(onView: self.view)
        if let contentUrlString = contentUrlString,
            let profileUrlString = profileUrlString {
            cell.contentImage.loadCachedImage(contentUrlString)
            cell.profileImage.loadCachedImage(profileUrlString)
            DispatchQueue.main.async {
                self.removeSpinner(spinner: loadingIndicator)
            }
        }
    }
    
    private func showUserRated(_ user: AppUser, _ rating: Double) {
        let dvc = RatedUserViewController.instantiate(fromAppStoryboard: .RatedUserViewController)
        dvc.userRated = user
        dvc.rating = rating
        present(dvc, animated: true, completion: nil)
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
                self.showUserRated(user, rating)
                self.uploadToUserActivity(currentUid, uid, rating, currentCell.key!)
                try! uiRealm.write {
                    currentCell.rating.value = rating
                }
            }
        }
        return cell
    }
    
    func uploadToUserActivity(_ currentUid: String,
                              _ otherUid: String,
                              _ rating: Double,
                              _ postKey: String) {
        /*
         - user-activity
            -currentUid
                - otherUid
                - otherUid
         */
        fbManager?.updateWhoRated(currentUid, otherUid, rating, postKey)
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell,
                   forRowAt indexPath: IndexPath) {
        cell.backgroundColor = UIColor.clear
    }
}

// mirtest refactor this..
extension HomepageViewController: UITabBarControllerDelegate {
    
    func tabBarController(_ tabBarController: UITabBarController, didSelect viewController: UIViewController) {
        
        print("selected view controller laaaa\(tabBarController.selectedIndex)")
        if tabBarController.selectedIndex == 1 {
            let upload = UploadViewController.instantiate(fromAppStoryboard: .UploadViewController)
            let uploadNav = UINavigationController(rootViewController: upload)
            
            present(uploadNav, animated: true, completion: {
                tabBarController.selectedIndex = 0
            })
        }
    }
}

