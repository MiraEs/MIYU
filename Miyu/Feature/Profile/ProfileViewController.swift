//
//  ProfileViewController.swift
//  Simi
//
//  Created by Mira Estil on 1/31/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import CoreData

class ProfileViewController: BaseViewController {

    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var userRating: UILabel!
    @IBOutlet weak var userAttribute: UILabel!
    @IBOutlet weak var profileMenuBar: MenuBar!
    @IBOutlet weak var customTabView: CustomTabView!
    
    private var posts: [NSManagedObject] = []
    
    private var viewModel: ProfileUserDataModel? {
        return ProfileUserDataModel()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
//              print(">>>>> POSTS FROM CORE DATA >>>>>> \(posts[0].value(forKeyPath: "caption") as? String)")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
  
    }

    private func setup() {
        profileMenuBar.customDelegate = customTabView
        profileImage.setRounded()
        loadUserData()
        //getData()
        
    }

    // MARK: FETCH DATA
    private func loadUserData() {
        viewModel?.loadUserData({ [weak self] (user) in
            self?.setUserData(user)
        })
    }
    
    private func getData() {
        //1
        guard let appDelegate =
            UIApplication.shared.delegate as? AppDelegate else {
                return
        }
        
        let managedContext =
            appDelegate.persistentContainer.viewContext
        
        //2
        let fetchRequest =
            NSFetchRequest<NSManagedObject>(entityName: "CPost")
        
        //3
        do {
            posts = try managedContext.fetch(fetchRequest)
            print("HERE ARE THE MOFO POSTS >>>>>>>>> \(posts)")
        } catch let error as NSError {
            print("Could not fetch. \(error), \(error.userInfo)")
        }
    }
    
    private func setUserData(_ user: AppUser) {
        guard let url = user.photoUrl else { return }
        
        profileImage.loadCachedImage(url)
        guard let firstName = user.firstName,
            let lastName = user.lastName,
            let rating = user.userRating else { return }
        userName.text = "\(firstName) \(lastName)"
        userRating.text = "\(rating)"
    }
}


