//
//  BaseViewController.swift
//  Simi
//
//  Created by Mira Estil on 1/30/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

internal class BaseViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
    }
    
    private func setup() {
        gradientBackground()
        keyboardFunctionality()
    }
    
    private func design() {
        //let pinkColor = UIColor(red:0.96, green:0.81, blue:0.76, alpha:1.0)
        //view.backgroundColor = pinkColor
        
        let blurEffect = UIBlurEffect(style: UIBlurEffectStyle.light)
        let blurEffectView = UIVisualEffectView(effect: blurEffect)
        blurEffectView.frame = view.bounds
        blurEffectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        //view.addSubview(blurEffectView)
        view.insertSubview(blurEffectView, at: 1)
    }
    
    private func gradientBackground() {
        
        let pinkColor = UIColor(red:0.96, green:0.81, blue:0.76, alpha:1.0)
        let darkPink = UIColor(red:0.93, green:0.60, blue:0.57, alpha:1.0)
        let gradientLayer = CAGradientLayer()
        
        gradientLayer.frame = self.view.bounds
        
        gradientLayer.colors = [pinkColor.cgColor, darkPink.cgColor]
        
        gradientLayer.locations = [0.0, 0.72]
        view.layer.insertSublayer(gradientLayer, at: 0)
        
    }
    
    private func keyboardFunctionality() {
        self.hideKeyboardWhenTap()
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillShow), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillHide), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
}

extension BaseViewController {
//    func saveData(item: Post, _ store: DataStore) {
//        store.posts.append(item)
//
//        NSKeyedArchiver.archiveRootObject(store.posts, toFile: store.filePath)
//    }
//
//    func loadData(_ store: DataStore) {
//        if let ourData = NSKeyedUnarchiver.unarchiveObject(withFile: store.filePath) as? [Post] {
//            store.posts = ourData
//        }
//    }
    
//    func saveData(_ item: Post, _ store: DataStore) {
//        store.posts.append(item)
//        do {
//            //let data = try Post().encode(item)
//            //let data = try JSONSerialization.data(withJSONObject: store.posts, options: []).dictionary
//            let success = NSKeyedArchiver.archiveRootObject(item, toFile: store.filePath)
//            print(success ? "Successful save" : "Save Failed")
//        } catch {
//            print("Save Failed")
//        }
//    }
//    func loadData(_ store: DataStore)  {
//        guard let data = NSKeyedUnarchiver.unarchiveObject(withFile: store.filePath) as? Data else { return }
//        do {
//            //let posts = try Post().decode([Post].self, from: data)
//            let posts = try JSONDecoder().decode(Post.self, from: data)
//            //return posts
//            print("POSTS LOAD FROM ARCHIVE >>>>>>>>>>>>>>>>>\(posts)")
//        } catch {
//            print("Retrieve Failed")
//            //return nil
//        }
//    }
    
    func saveData(_ posts: [Post], store: DataStore) {
        // 1. Create a URL for documents-directory/posts.json
        let url = store.filePath
        // 2. Endcode our [Post] data to JSON Data
        let encoder = JSONEncoder()
        do {
            let data = try encoder.encode(posts)
            // 3. Write this data to the url specified in step 1
            try data.write(to: url, options: [])
        } catch {
            fatalError(error.localizedDescription)
        }
    }
    
    func loadData(_ store: DataStore) -> [Post] {
        // 1. Create a url for documents-directory/posts.json
        let url = store.filePath
        let decoder = JSONDecoder()
        do {
            // 2. Retrieve the data on the file in this path (if there is any)
            let data = try Data(contentsOf: url, options: [])
            // 3. Decode an array of Posts from this Data
            let posts = try decoder.decode([Post].self, from: data)
            return posts
        } catch {
            fatalError(error.localizedDescription)
        }
    }
}
