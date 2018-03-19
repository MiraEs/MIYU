//
//  HomepageViewModel.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase
import CoreData

internal final class HomepageViewModel: InstantiatedViewControllers {
    
    private var presentingViewController: UIViewController
    
    private weak var fbManager = FirebaseUserManager.manager
    
    var posts: [NSManagedObject] = []
    
    init(_ presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
        
    }
    
    // MARK: UTILITY
    func setup(_ tableView: UITableView) {
        tableView.register(UINib(nibName: Constants.homeXib, bundle: nil),
                           forCellReuseIdentifier: Constants.homeCell)
    }
    
    func presentVC(vc: PresentViewController) {
        presentDestinationVC(from: self.presentingViewController, to: vc)
    }
    
    // MARK: PREPARE DATA
    
    func getPosts(_ completion: @escaping (_ posts: Post)->Void) {
        fbManager?.getPosts(eventType: .childAdded, with: { (snapshot) in
            do {
                if JSONSerialization.isValidJSONObject(snapshot.value!) {
                    let data = try JSONSerialization.data(withJSONObject: snapshot.value!, options: [])
                    let post = try JSONDecoder().decode(Post.self, from: data)
                    
                    self.fbManager?.getUserData(post.uid!, { (user) in
                        post.user = user
                        post.key = snapshot.key
                        completion(post)
                        self.save(postData: post)
                    })
                }
            } catch {
                print(error)
            }
        })
    }
    
    // MARK: CORE DATA AFTER SUCCESFUL LOGIN
    
    
    private func save(postData: Post) {
        
        guard let appDelegate =
            UIApplication.shared.delegate as? AppDelegate else {
                return
        }
        // 1
        let managedContext =
            appDelegate.persistentContainer.viewContext
        let container = appDelegate.persistentContainer
        
        // 2
        let postEntity = NSEntityDescription.entity(forEntityName: "CPost",
                                       in: managedContext)!
        
        let post = NSManagedObject(entity: postEntity,
                                   insertInto: managedContext)
        
        let userEntity = NSEntityDescription.entity(forEntityName: "CAppUser", in: managedContext)!
        let user = NSManagedObject(entity: userEntity, insertInto: managedContext)
        // 3
        post.setValuesForKeys(postData.dictionary!)
        user.setValuesForKeys(postData.user.dictionary!)
        
        let userObject = NSSet(object: user)
        post.setValue(userObject, forKey: "user")
        
        
        // 4
        do {
            
            try managedContext.save()
            posts.append(post)
            print("SAVING POST HERE >>>>>>> \(post)")
        } catch let error as NSError {
            print("Could not save. \(error), \(error.userInfo)")
        }
    }
}
