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
    case posts, user
}

internal final class FirebaseUserManager {
    
    static let manager = FirebaseUserManager()
    
    private weak var currentUser: User? {
        get {
            return Auth.auth().currentUser
        }
    }
    private weak var ref: DatabaseReference! {
        get {
            return Database.database().reference()
        }
    }
    private weak var postRef: DatabaseReference? {
        get {
            return ref.child(FbChildPaths.posts)
        }
    }
    private init() {}
    
    // MARK: GET USER DATA
    // TODO: FINISH
    func getCurrentUserData(_ userID: String) {
        //guard let userID = Auth.auth().currentUser?.uid else { return }
        ref.child(FbChildPaths.users).child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            
            guard let value = snapshot.value as? [String:String] else { return }
            
            print("Snapshot \(value)")
            
        }) { (error) in
            print(error.localizedDescription)
        }
    }
    
    func getPosts(eventType: DataEventType, with handler: @escaping (DataSnapshot) -> Void) {
        postRef?.observe(eventType, with: handler)
    }
    
    func getUsers(eventType: DataEventType, uid: String, with handler: @escaping (DataSnapshot) -> Void) {
        ref?.child(FbChildPaths.users).child(uid).observe(eventType, with: handler)
    }
}

extension FirebaseUserManager {
    // MARK: UPLOAD NEW POSTS
    ///1. New post uploaded to Database
    private func uploadPost(_ contentUrl: String, _ caption: String?, _ event: Children) {
        let key = ref.child(event.rawValue).childByAutoId().key
        guard let uid = currentUser?.uid,
            let caption = caption else {
                return
        }
        
        guard let post = Post(caption: caption, data: contentUrl, uid: uid).dictionary else { return }
        let childUpdates: [String: Any] = ["/posts/\(key)" : post,
                                           "/user-posts/\(uid)/\(key)/" : post]
        
        ref.updateChildValues(childUpdates)
    }
    
    //TODO: Fix to include video content as well
    //2. New post content uploaded to storage
    func uploadContentToStorage(with content: UIImageView, to path: Children, _ caption: String, completionHandler: @escaping ()->Void) {
        let contentName = NSUUID().uuidString
        let storageRef = Storage.storage().reference().child(FbChildPaths.users).child((currentUser?.uid)!).child("\(contentName)")
        
        let uploadData = Image.convertToPngData(with: content.image!)
        
        storageRef.putData(uploadData!, metadata: nil, completion: { (metadata, error) in
            if error != nil {
                print(error!)
            }

            if let urlString = metadata?.downloadURL()?.absoluteString {
                if path == .posts {
                    self.uploadPost(urlString, caption, .posts)
                }
                completionHandler()
            }
        })
    }

}

extension FirebaseUserManager {

    // MARK: RATING
    /**
     1. Get count and add number of rates (after tapping star)
     2. Upload new count to database
     3. Calculate post's average rating
     4. Upload new average rating to database
     -- TODO:
     5. ?? When ?? Calculate all post averages for specific user of post recently rated
     6. Upload new user rating average
     **/
    
    //1. Get count and add number of rates
    func updatePostRatedCount(_ key: String) {
        let ref = postRef?.child(key)
        
        ref?.observeSingleEvent(of: .value, with: { (snapshot) in
            guard let post = self.decodeData(snapshot.value as Any) else { return }
            guard let count = post.count else { return }
            let newCount = count + 1
            post.key = key
            post.count = newCount
            self.uploadPostRatedCount(post)
            self.calculatePostAverageRating(post)
        })
    }
    
    //2. Upload new count to database
    private func uploadPostRatedCount(_ post: Post) {
        guard let key = post.key,
            let newCount = post.count else {
                return
        }
        postRef?.child(key).updateChildValues([PostKeys.count: newCount])
    }
    
    //3.Calculate post's average rating
    /** @An = Average new, @Ao = Average old
     @Vn = new Value, @Sn = new Size
     THIS ONLY CALUCLATES WITH 1 ADDED VALUE TO AVERAGE
     An = Ao + ((Vn - Ao)/Sn)
     **/
    private func calculatePostAverageRating(_ post: Post) {
        print("CALCULATE AVERAGE FOR THIS POST......")
        guard let count = post.count,
            let averageRating = post.averageRating,
            let rating = post.rating else {
                return
        }
        
        let size: Double = Double(count)
        let oldAverage = averageRating
        let newValue = rating
        let newAverage = oldAverage + ((newValue - oldAverage)/size)
        print("newAverage >>>> \(newAverage)")
        post.averageRating = newAverage
        uploadPostAverageRating(post)
    }
    
    //4. Upload new average rating to database
    private func uploadPostAverageRating(_ post: Post) {
        guard let key = post.key,
            let uid = post.uid else {
            return
        }
        guard let validPost = post.dictionary else { return }
        let childUpdates: [String: Any] = ["/posts/\(key)/" : validPost,
                                           "/user-posts/\(uid)/\(key)/" : validPost]
        ref.updateChildValues(childUpdates)
        calculateAllPostsRating(uid)
    }
    
    /// USER
    //5. Calculate all post averages for specific user of post recently rated
    func calculateAllPostsRating(_ uid: String) {
        print("CALCULATE RATING for \(uid)")
        let userRef = ref.child(FbChildPaths.userPosts).child(uid)
        
        
        userRef.observe(.value) { (snapshot) in
            print("RATING SNAPSHOT COUNT \(snapshot.childrenCount)")
            let count = Float(snapshot.childrenCount)
            var sum: Float = 0.0
            var average: Float = 0.0
            
            let enumerator = snapshot.children
            while let object = enumerator.nextObject() as? DataSnapshot {
                if let value = object.value as? [String:AnyObject] {
                    guard let averageRating = value[PostKeys.averageRating] as? Float else { return }
                    sum += averageRating
                }
            }
            average = sum/count
            print("AVERAGE >>>> \(average)")
            
            //UPDATE USER RATING
            self.updateUserRating(with: average, uid)
        }
    }
    
    //6. Upload new user rating average
    private func updateUserRating(with average: Float, _ uid: String) {
        let userRef = ref.child(FbChildPaths.userRatings).child(uid)
        
        userRef.observe(.value) { (snapshot) in
            guard let currentRating = snapshot.value as? Float else { return }
            let newRating = (currentRating+average)/2
            userRef.setValue(newRating)
        }
    }
}

extension FirebaseUserManager {
    // MARK: BASIC LOGIN/REGISTRATION FLOW
    func createUser(appUser: AppUser, userCredentials: UserCredential, profileImage: UIImage, handler: (() -> ())? = nil) {
        guard let email = userCredentials.email,
            let password = userCredentials.password else {
                return
        }
        

        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if user != nil {
                self.addToDatabase(appUser, user!, profileImage)
                print("successful user added \(email)")
                handler?()
            } else {
                // TODO: Create error alert class
                print(error?.localizedDescription ?? "Unknown error")
            }
        })
    }
    
    private func addToDatabase(_ userInfo: AppUser, _ currentUser: User, _ profileImage: UIImage) {
        
        let contentName = NSUUID().uuidString
        let storageRef = Storage.storage().reference().child(FbChildPaths.users).child((currentUser.uid)).child("\(contentName)_profile_image")
        
        let uploadData = profileImage.toPngData()
        
        storageRef.putData(uploadData!, metadata: nil, completion: { (metadata, error) in
            if error != nil {
                print(error!)
            }
            
            if let urlString = metadata?.downloadURL()?.absoluteString {
                self.ref.child(FbChildPaths.users).child(currentUser.uid).setValue(["photoUrl" : urlString])
            }
            
            let userData = userInfo.dictionary
            self.ref.child(FbChildPaths.users).child(currentUser.uid).updateChildValues(userData!)
            self.ref.child(FbChildPaths.userRatings).child(currentUser.uid).setValue(userInfo.userRating)
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
}

extension FirebaseUserManager {
    //TODO: REFACTOR TO EXTENSION/*******************/
    private func decodeData(_ snapshot: Any) -> Post? {
        guard let data = try? JSONSerialization.data(withJSONObject: snapshot, options: []) else {
            return nil
        }
        
        guard let post = try? JSONDecoder().decode(Post.self, from: data) else { return nil }
        return post
    }
}
