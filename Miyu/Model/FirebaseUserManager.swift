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
    
    // MARK: BASIC LOGIN/REGISTRATION FLOW
    
    func createUser(user: AppUser, userCredentials: UserCredential, handler: (() -> ())? = nil) {
        guard let email = userCredentials.email,
            let password = userCredentials.password,
            let userInfo = user.userInfo else {
                return
        }
        
        
        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if user != nil {
                self.ref.child(FbChildPaths.users).child(user!.uid).setValue(userInfo)
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
        ref.child(FbChildPaths.users).child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            
            guard let value = snapshot.value as? [String:String] else { return }
            //let firstName = value["firstName"] as? String ?? ""
            print("Snapshot \(value)")
            
        }) { (error) in
            print(error.localizedDescription)
        }
    }
    
    func getPosts(eventType: DataEventType, with handler: @escaping (DataSnapshot) -> Void) {
        postRef?.observe(eventType, with: handler)
    }
    
    // MARK: UPLOAD DATA
    // TODO: IMPLEMENT RATING PROPERTY FOR EACH POST
    
    /// POST
    
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
    
    private func uploadPostRatedCount(_ post: Post, _ newCount: Int) {
        guard let key = post.key else { return }
        postRef?.child(key).updateChildValues([PostKeys.count: newCount])
    }
    
    private func uploadPostAverageRating(_ newRating: Double, _ postRef: DatabaseReference) {
        postRef.updateChildValues([PostKeys.averageRating: newRating])
    }
    
    func updatePostRatedCount(_ key: String) {
        //let ref = postRef?.child(key)
        
//        ref?.observeSingleEvent(of: .value) { (snapshot) in
//            if let value = snapshot.value as? [String:AnyObject] {
//                guard let count = value[PostKeys.count] as? Int,
//                    let averageRating = value[PostKeys.averageRating] as? Double,
//                    let rating = value[PostKeys.rating] as? Double else { return }
//                let newCount = count + 1
//
//
//                // Update Count and Post average rating
//                self.uploadPostRatedCount(key, newCount)
//                self.calculatePostAverageRating(newCount, averageRating, rating, ref!)
//            }
//        }
        meh(key)
    }
    //MIRTEST
    
    func meh(_ key: String) {
        let ref = postRef?.child(key)
        
        ref?.observeSingleEvent(of: .value, with: { (snapshot) in
            guard let post = self.decodeData(snapshot.value) else { return }
            guard let count = post.count else { return }
            let newCount = count + 1
            self.uploadPostRatedCount(post, newCount)
            self.calculatePostAverageRating(post)
        })
    }
    
    //TODO: REFACTOR TO EXTENSION/*******************/
    private func decodeData(_ snapshot: Any) -> Post? {
        let data = try? JSONSerialization.data(withJSONObject: snapshot, options: [])
        guard let post = try? JSONDecoder().decode(Post.self, from: data!) else { return nil }
        return post
    }
    
    /// USER
    
    private func updateUserRating(with average: Float, _ uid: String) {
        let userRef = ref.child(FbChildPaths.userRatings).child(uid)
        
        userRef.observe(.value) { (snapshot) in
            guard let currentRating = snapshot.value as? Float else { return }
            let newRating = (currentRating+average)/2
            userRef.setValue(newRating)
        }
    }
    
    /// POST CONTENT
    
    //TODO: Fix to include video content as well
    func uploadContentToStorage(with content: UIImageView, caption: String?, completionHandler: @escaping ()->Void) {
        let contentName = NSUUID().uuidString
        let storageRef = Storage.storage().reference().child(FbChildPaths.users).child((currentUser?.uid)!).child("\(contentName)")
        
        if let image = content.image {
            let uploadData = UIImagePNGRepresentation(image)
            
            storageRef.putData(uploadData!, metadata: nil, completion: { (metadata, error) in
                if error != nil {
                    print(error!)
                }
                
                if let urlString = metadata?.downloadURL()?.absoluteString {
                    self.uploadPost(urlString, caption, .posts)
                    completionHandler()
                }
            })
        }
    }
    
    // MARK: CALCULATE POST & USER RATINGS
    
    // @An = Average new, @Ao = Average old
    // @Vn = new Value, @Sn = new Size
    // THIS ONLY CALUCLATES WITH 1 ADDED VALUE TO AVERAGE
    // An = Ao + ((Vn - Ao)/Sn)
    private func calculatePostAverageRating(_ post: Post) {
        print("CALCULATE AVERAGE FOR THIS POStT......")
        guard let count = post.count,
            let averageRating = post.averageRating,
            let rating = post.rating,
            let key = post.key else {
            return
        }
        
        let size: Double = Double(count)
        let oldAverage = averageRating
        let newValue = rating
        let newAverage = oldAverage + ((newValue - oldAverage)/size)
        print("newAverage >>>> \(newAverage)")
        
        let ref = postRef?.child(key)
        uploadPostAverageRating(newAverage, ref!)
    }
    
    func calculateAllPostsRating(_ uid: String) {
        print("CALCULATE RATING for \(uid)")
        let userRef = ref.child(FbChildPaths.userPosts).child(uid)
        
        
        userRef.observe(.childChanged) { (snapshot) in
            print("RATING SNAPSHOT COUNT \(snapshot.childrenCount)")
            let count = Float(snapshot.childrenCount)
            var sum: Float = 5.0
            var average: Float = 0.0
            
            if let children = snapshot.value as? [String:AnyObject] {
                for child in children {
                    if let value = child.value as? [String:AnyObject] {
                        guard let rating = value[PostKeys.rating] as? Float else { return }
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
    
    
}
