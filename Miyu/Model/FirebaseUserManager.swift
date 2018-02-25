//
//  FirebaseUserManager.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import Firebase

enum Children: String {
    case posts
}

internal final class FirebaseUserManager {
    
    static let manager = FirebaseUserManager()
    
    var currentUser: User? {
        get {
            return Auth.auth().currentUser
        }
    }
    
    var ref: DatabaseReference! {
        get {
            return Database.database().reference()
        }
    }

    
    private init() {}
    
    // MARK: BASIC LOGIN/REGISTRATION FLOW
    func createUser(user: AppUser, userCredentials: UserCredential, handler: (() -> ())? = nil) {
        guard let email = userCredentials.email,
            let password = userCredentials.password,
            let userInfo = user.userInfo else {
                return
        }
        
    
        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if user != nil {
                self.ref.child("users").child((user!.uid)).setValue(userInfo)
                print("successful user added \(email)")
                handler?()
            } else {
                // TODO: Create error alert class
                print(error?.localizedDescription ?? "Unknown error")
            }
        })
    }
    
    func login(user: UserCredential, handler: (()->())? = nil) {
        guard let email = user.email,
            let password = user.password else {
                return
        }
        
        Auth.auth().signIn(withEmail: email, password: password) { (user, error) in
            if user != nil {
                handler?()
            } else {
                // TODO: create error alert class
                print(error.debugDescription)
            }
        }
    }
    
    func signOut() {
        do {
            print("signing out \(String(describing: currentUser?.email))")
            try Auth.auth().signOut()
        } catch let signOutError as NSError {
            print("Error signing out: %@", signOutError)
        }
    }
    
    // MARK: FETCHING DATA
    // TODO: FINISH
    func getCurrentUserData() {
        guard let userID = Auth.auth().currentUser?.uid else { return }
        ref.child("users").child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            
            guard let value = snapshot.value as? [String:String] else { return }
            //let firstName = value["firstName"] as? String ?? ""
            print("Snapshot \(value)")
            
        }) { (error) in
            print(error.localizedDescription)
        }
    }
    
    func getPosts() -> [[String:String]]? {
        var returnValue = [[String:String]]()
        ref.child("posts").observe(.value) { (snapshot) in
            
            let enumerator = snapshot.children
            while let rest = enumerator.nextObject() as? DataSnapshot {
                
                guard let value = rest.value as? [String:String] else { return }
                print("VALUE \(value)")
                returnValue.append(value)
            }
        }
        return returnValue
    }
    
    func fetchPosts(eventType: DataEventType, with handler: @escaping (DataSnapshot) -> Void) {
        ref.child("posts").observe(eventType, with: handler)
    }
    
    // MARK: POSTING DATA
    // TODO: IMPLEMENT RATING PROPERTY FOR EACH POST
    private func uploadToDatabase(_ contentUrl: String, _ event: Children) {
        guard let uid = currentUser?.uid else { return }
        // childByAutoId used for chronologicallly adding
        let key = ref.child(event.rawValue).childByAutoId().key
        let post: [String : Any] = [
            "caption" : "caption with rating",
            "data" : contentUrl,
            "rating" : 0.0,
            "uid" : uid,
            "count": 0 ]
        
        let userPost: [String : Any] = [
            "caption" : "caption with rating",
            "data" : contentUrl,
            "rating" : 0.0 ]
        
        let childUpdates = ["/posts/\(key)" : post,
                            "/user-posts/\(uid)/\(key)/" : userPost,
                            "/user-ratings/\(uid)/" : 4.5
            ] as [String : Any]
        ref.updateChildValues(childUpdates)
        print("updating to firebase using fb manager")
    }
    
    func updateCount(_ key: String) {
        let postRef = ref.child("posts").child(key)
        
        postRef.observeSingleEvent(of: .value) { (snapshot) in
            if let value = snapshot.value as? [String:AnyObject] {
                guard let count = value["count"] as? Int else { return }
                let newCount = count + 1
                
                //postRef.updateChildValues(["count": newCount])
                self.uploadCount(key, newCount)
                print("NEW COUNT >>>> \(newCount)")
            }
        }
    }
    
    private func uploadCount(_ key: String, _ count: Int) {
        let postRef = ref.child("posts").child(key)
        postRef.updateChildValues(["count": count])
    }
    
    
    func calculateAllPostsRating(_ uid: String) {
        print("CALCULATE RATING for \(uid)")
        let userRef = ref.child("user-posts").child(uid)
        
        
        userRef.observe(.childChanged) { (snapshot) in
            print("RATING SNAPSHOT COUNT \(snapshot.childrenCount)")
            let count = Float(snapshot.childrenCount)
            var sum: Float = 5.0
            var average: Float = 0.0
            
            if let children = snapshot.value as? [String:AnyObject] {
                for child in children {
                    if let value = child.value as? [String:AnyObject] {
                        guard let rating = value["rating"] as? Float else { return }
                        sum += rating
                    }
                }
            }
            average = sum/count
            print("AVERAGE >>>> \(average)")
            
            //UPDATE USER RATING
            self.updateUserRating(with: average, uid)
        }
    }

    
    private func updateUserRating(with average: Float, _ uid: String) {
        let userRef = ref.child("user-ratings").child(uid)
        
        userRef.observe(.value) { (snapshot) in
            guard let currentRating = snapshot.value as? Float else { return }
                let newRating = (currentRating+average)/2
                userRef.setValue(newRating)
        }
    }

    
    
    //TODO: Fix to include video content as well
    func uploadContentToStorage(with content: UIImageView, completionHandler: @escaping ()->Void) {
        let contentName = NSUUID().uuidString
        let storageRef = Storage.storage().reference().child("users").child((currentUser?.uid)!).child("\(contentName)")
        
        if let image = content.image {
            let uploadData = UIImagePNGRepresentation(image)
            
            storageRef.putData(uploadData!, metadata: nil, completion: { (metadata, error) in
                if error != nil {
                    print(error!)
                }
                
                if let urlString = metadata?.downloadURL()?.absoluteString {
                    self.uploadToDatabase(urlString, .posts)
                    completionHandler()
                }
            })
        }
    }
}
