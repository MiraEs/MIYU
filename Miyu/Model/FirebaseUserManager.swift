//
//  FirebaseUserManager.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Firebase


enum UserActivityAction: String {
    case rated = "rated"
    case ratedBy = "rated-by"
}

internal final class FirebaseUserManager {
    
    static let manager = FirebaseUserManager()
    let fbService = FirebaseSerivce.shared
    
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
    
    private weak var userActivity: DatabaseReference? {
        return ref.child("user-activity")
    }
    
    private init() {}
    
    // MARK: GET USER DATA
    
    func getUsers(eventType: DataEventType, uid: String, with handler: @escaping (DataSnapshot) -> Void) {
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
        guard let uid = currentUser?.uid else { return }
        let userRef = userFriendsRef?.child(uid)
        
        userRef?.observeSingleEvent(of: .value, with: { (snapshot) in
            let enumerator = snapshot.children
            while let object = enumerator.nextObject() as? DataSnapshot {
                do {
                    let data = try JSONSerialization.data(withJSONObject: object.value!, options: [])
                    let user = try JSONDecoder().decode(AppUser.self, from: data)
                    user.keyUid = object.key
                    RealmService.shared.update(user, with: ["keyUid":object.key])
                    handler(user)
                } catch {
                    print(error)
                }
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
        let activityRef = userActivity?.child(currentUser!.uid).child("\(UserActivityAction.rated)")
        
        ref?.observeSingleEvent(of: .value, with: { (snapshot) in
            print("NETWORK - CHECKING OLD CALCULATE AVERAGES")
            guard let post = self.decodeData(snapshot.value as Any) else { return }
            guard let count = post.count.value else { return }
            
            
            activityRef?.observeSingleEvent(of: .value, with: { (snapshot) in
                let objects = snapshot.children.allObjects as! [DataSnapshot]
                if !objects.contains(where: {$0.key == key}) {
                    let newCount = count + 1
                    post.key = key
                    post.count.value = newCount
                    self.uploadPostRatedCount(post)
                    self.updateUserActivity(key)
                }
            })
            self.calculatePostAverageRating(post)
        })
    }
    
    //MIRTEST
    //MIRTEST
    //MIRTEST
    //MIRTEST//MIRTEST//MIRTEST//MIRTEST//MIRTEST//MIRTEST//MIRTEST//MIRTEST//MIRTEST******
    func updateUserActivity(_ key: String) {
        let ref = userActivity?.child(currentUser!.uid).child("\(UserActivityAction.rated)")
        
        let value: [String: Any] = [key : true]
        ref?.updateChildValues(value)
    }
    
    func updateWhoRated(_ currentUid: String, _ otherUid: String, _ rating: Double, _ postKey: String) {
        let ref = userActivity?.child(otherUid).child("\(UserActivityAction.ratedBy)")
        
        // value represents the rating of post
        /*
         - user-activity
         -rated
         -rated-by
         - otherUid
         - YOURuid
         -post key
         -rating of post (number)
         */
        let value: [String: Any] = [currentUid :
            [
                "postID": postKey,
                "postRatingFromUser" : rating
            ]]
        ref?.updateChildValues(value)
    }
    
    func getWhoRatedUsers() {
        let ref = userActivity?.child(currentUser!.uid).child("\(UserActivityAction.ratedBy)")
        ref?.queryLimited(toLast: 5).observeSingleEvent(of: .value, with: { (snapshot) in
            var tempArr = [AppUser]()
            for child in snapshot.children {
                let snap = child as! DataSnapshot
                let object = snap.value
                let uid = snap.key
                self.getUserData(uid, { (user) in
                    tempArr.append(user)
                })
            }
            print("TEMPPP ARRR >>>>> \(tempArr)")
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
    //MARK: BASIC LOGIN/REGISTRATION FLOW
    func createUser(appUser: AppUser,
                    userCredentials: UserCredential,
                    profileImage: UIImage,
                    handler: (() -> ())? = nil) {
        guard let email = userCredentials.email,
            let password = userCredentials.password else {
                return
        }
        
        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if let user = user?.user {
                FirebaseHelper.addToStorage(user, profileImage, { (urlString) in
                    let uid = user.uid
                    self.addToDatabase(appUser, urlString, uid)
                })
                handler?()
            } else {
                print(error?.localizedDescription ?? "Unknown error")
            }
        })
    }
    
    private func addToDatabase(_ userInfo: AppUser, _ photoUrl: String, _ uid: String) {
        guard let userData = userInfo.dictionary else { return }
        self.ref.child(FbChildPaths.users).child(uid).updateChildValues(["photoUrl" : photoUrl])
        self.ref.child(FbChildPaths.users).child(uid).updateChildValues(userData)
        self.ref.child(FbChildPaths.userRatings).child(uid).setValue(userInfo.userRating)
    }

    
    func login(user: UserCredential, handler: (()->())? = nil) {
        guard let email = user.email,
            let password = user.password else {
                return
        }
        
        Auth.auth().signIn(withEmail: email, password: password) { (user, error) in
            if user != nil {
                guard let uid = self.currentUser?.uid else { return }
                
                if uiRealm.object(ofType: AppUser.self, forPrimaryKey: uid) != nil {
                    self.store?.currentUser = uiRealm.object(ofType: AppUser.self, forPrimaryKey: uid)
                } else {
                    self.fbService.getData(.user(uid: uid), AppUser.self, { (user, keyId) in
                        user.uid = keyId
                        RealmService.shared.save(user)
                    })
                }
                
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

struct FirebaseHelper {
    static func addToStorage(_ currentUser: User,
                                       _ profileImage: UIImage,
                                       _ handler: @escaping (String)->()) {
        
        let contentName = NSUUID().uuidString
        let storageRef = Storage.storage().reference().child(FbChildPaths.users).child((currentUser.uid)).child("\(contentName)")
        let uploadData = profileImage.toPngData()
        
        storageRef.putData(uploadData!, metadata: nil, completion: { (metadata, error) in
            if error != nil {
                print(error!)
            }
            
            storageRef.downloadURL(completion: { (url, error) in
                if error != nil {
                    print(error!.localizedDescription)
                } else if let urlString = url?.absoluteString {
                    handler(urlString)
                }
            })
        })
    }
}
