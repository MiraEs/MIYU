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
    
    var currentUser: User? {
        return Auth.auth().currentUser
    }
    
    private weak var store = DataStore.sharedInstance
    
    private weak var ref: DatabaseReference! {
        return Database.database().reference()
    }
    private weak var postRef: DatabaseReference? {
        return ref.child(FbChildPaths.posts)
    }
    
    private weak var userPostRef: DatabaseReference? {
        return ref.child(FbChildPaths.userPosts)
    }
    
    private weak var userFriendsRef: DatabaseReference? {
        return ref.child(FbChildPaths.userFriends)
    }
    
    private init() {}
    
    // MARK: GET USER DATA
    
    func getPosts(eventType: DataEventType, with handler: @escaping (DataSnapshot) -> Void) {
        print("NEWORK CALL - POSTS")
        postRef?.observe(eventType, with: handler)
    }
    
    func getUserPosts(uid: String, eventType: DataEventType, with handler: @escaping (Post) -> Void) {
        print("NEWORK CALL - POSTS")
        let userRef = userPostRef?.child(uid)
        userRef?.observeSingleEvent(of: .value) { (snapshot) in
            let enumerator = snapshot.children
            while let object = enumerator.nextObject() as? DataSnapshot {
                do {
                    let data = try JSONSerialization.data(withJSONObject: object.value!, options: [])
                    let post = try JSONDecoder().decode(Post.self, from: data)
                    handler(post)
                } catch {
                    print(error)
                }
            }
        }
    }
    
    func getUsers(eventType: DataEventType, uid: String, with handler: @escaping (DataSnapshot) -> Void) {
        print("NEWORK CALL - USERS")
        ref?.child(FbChildPaths.users).child(uid).observe(eventType, with: handler)
    }
    
    //TODO:: REFACTOR FROM HOMEPAGE CELL
    func getUserData(_ uid: String, _ handler: @escaping (_ user: AppUser)->Void) {
        print("NEWORK CALL - USER")
        self.getUsers(eventType: .value, uid: uid, with: { (snapshot) in
            do {
                if JSONSerialization.isValidJSONObject(snapshot.value!) {
                    let data = try JSONSerialization.data(withJSONObject: snapshot.value!, options: [])
                    
                    let user = try JSONDecoder().decode(AppUser.self, from: data)
                    
                    handler(user)
                }
            } catch {
                print(error)
            }
        })
    }
}

extension FirebaseUserManager {
    // MARK: ADD NEW FRIENDS
    func addFriend(_ friendUid: String?) {
    
        guard let uid = currentUser?.uid,
                let friendUid = friendUid else {
                return
        }
        let userRef = userFriendsRef?.child(uid)
        
        userRef?.observeSingleEvent(of: .value, with: { (snapshot) in
            print("NETWORK - CHECKING FRIEND LIST")
            if snapshot.hasChild(friendUid) {
                return
            } else {
                self.getUserData(friendUid) { (user) in
                    let userDict = user.dictionary
                    let childUpdates: [String:Any] = ["/user-friends/\(uid)/\(friendUid)/": userDict!]
                    self.ref.updateChildValues(childUpdates)
                }
            }
        })
    }
    
    
    
    func getFriends(_ handler: @escaping (_ user: AppUser)->Void) {
        print("NEWORK CALL - FRIENDS")
        guard let uid = currentUser?.uid else { return }
        let userRef = userFriendsRef?.child(uid)
        
        userRef?.observeSingleEvent(of: .value, with: { (snapshot) in
            let enumerator = snapshot.children
            while let object = enumerator.nextObject() as? DataSnapshot {
                do {
                    let data = try JSONSerialization.data(withJSONObject: object.value!, options: [])
                    let user = try JSONDecoder().decode(AppUser.self, from: data)
                    print("USER'S UID >>>> \(object.key)")
                    user.keyUid = object.key
                   handler(user)
                    
                } catch {
                    print(error)
                }
            }
        })
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
        
        guard let post = Post(caption: caption, data: contentUrl, uid: uid, key: key).dictionary else { return }
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
            print("NETWORK - CHECKING OLD CALCULATE AVERAGES")
            guard let post = self.decodeData(snapshot.value as Any) else { return }
            guard let count = post.count.value else { return }
            let newCount = count + 1
            post.key = key
            post.count.value = newCount
            self.uploadPostRatedCount(post)
            self.calculatePostAverageRating(post)
        })
    }
    
    //2. Upload new count to database
    private func uploadPostRatedCount(_ post: Post) {
        guard let key = post.key,
            let newCount = post.count.value else {
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
        guard let count = post.count.value,
            let averageRating = post.averageRating.value,
            let rating = post.rating.value else {
                return
        }
        
        let size: Double = Double(count)
        let oldAverage = averageRating
        let newValue = rating
        let newAverage = oldAverage + ((newValue - oldAverage)/size)
        print("newAverage >>>> \(newAverage)")
        post.averageRating.value = newAverage
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
        let userRef = ref.child(FbChildPaths.userPosts).child(uid)
        
        userRef.observeSingleEvent(of: .value) { (snapshot) in
            print("NEWORK CALL - CALCULATE")
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
            
            //UPDATE USER RATING
            self.updateUserRating(with: average, uid)
        }
    }
    
    
    //6. Upload new user rating average
    private func updateUserRating(with average: Float, _ uid: String) {
        let userRef = ref.child(FbChildPaths.userRatings).child(uid)
        
        userRef.observeSingleEvent(of: .value) { (snapshot) in
            print("NETWORK - UPDATE USER RATING FROM OLD VALUE")
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
    
    func signOut(_ completion: @escaping ()->()) {
        do {
            print("signing out \(String(describing: currentUser?.email))")
            try Auth.auth().signOut()
            completion()
        } catch let signOutError as NSError {
            print("Error signing out: %@", signOutError)
        }
    }
}

extension FirebaseUserManager {
    //TODO: REFACTOR FOR UNIVERSAL OBJECTS AND TO ITS ON FILE/*******************/
    private func decodeData(_ snapshot: Any) -> Post? {
        guard let data = try? JSONSerialization.data(withJSONObject: snapshot, options: []) else {
            return nil
        }
        
        guard let post = try? JSONDecoder().decode(Post.self, from: data) else { return nil }
        return post
    }
}
