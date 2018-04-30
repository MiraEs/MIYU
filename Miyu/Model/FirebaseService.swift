//
//  FirebaseService.swift
//  Miyu
//
//  Created by Mira Estil on 4/22/18.
//  Copyright © 2018 ME. All rights reserved.
//

///TODO: ERROR HANDLING, TYPEALIAS

import Foundation
import Firebase
import RealmSwift

enum DatabaseRefs {
    
    case parent
    case posts
    case users
    case user(uid: String)
    
    var value: DatabaseReference? {
        let ref = Database.database().reference()
        switch self {
        case .parent:
            return Database.database().reference()
        case .posts:
            return ref.child(FbChildPaths.posts)
        case .users:
            return ref.child(FbChildPaths.users)
        case .user(let uid):
            return ref.child(FbChildPaths.users).child(uid)
        }
    }
}

class FirebaseSerivce {
    private init() {}
    typealias CompletionHandler = (()->Void)?
    static let shared = FirebaseSerivce()
    private weak var store = DataStore.sharedInstance
    var currentUser: User? {
        return Auth.auth().currentUser
    }
    
    // SINGLE EVENTS
    func getAllData<T: Codable>(_ ref: DatabaseRefs,
                                _ objectType: T.Type,
                                _ completionHandler: @escaping (T)->Void) {
        ref.value?.queryLimited(toLast:30).observeSingleEvent(of: .value) { (snapshot) in
            let snaps = snapshot.children
            while let object = snaps.nextObject() as? DataSnapshot {
                do {
                    if let value = object.value {
                        let data = try JSONSerialization.data(withJSONObject: value, options: [])
                        let object = try JSONDecoder().decode(objectType, from: data)
                        print("OBJECT OBTAINED SENTING TO HANDLER")
                        completionHandler(object)
                    }
                } catch {
                    print(error)
                }
            }
        }
    }
    
    func getData<T: Codable>(_ ref: DatabaseRefs,
                             _ objectType: T.Type,
                             _ completionHandler: @escaping (T, _ keyId: String)->Void) {
        ref.value?.observeSingleEvent(of: .value, with: { (snapshot) in
            do {
                if let value = snapshot.value {
                    let data = try JSONSerialization.data(withJSONObject: value, options: [])
                    let object = try JSONDecoder().decode(objectType, from: data)
                    completionHandler(object, snapshot.key)
                }
            } catch {
                print(error)
            }
        })
    }
    
    func observeAllData<T: Codable>(_ ref: DatabaseRefs,
                                    _ objectType: T.Type,
                                    _ completionHandler: @escaping (T)->Void) {
        ref.value?.observe(.childAdded, with: { (snapshot) in
            do {
                if let value = snapshot.value {
                    let data = try JSONSerialization.data(withJSONObject: value, options: [])
                    let object = try JSONDecoder().decode(objectType, from: data)
                    print("OBJECT OBTAINED SENTING TO HANDLER")
                    completionHandler(object)
                }
            } catch {
                print(error)
            }
        }, withCancel: nil)
    }
    
    func uploadPost(_ ref: DatabaseRefs,
                    _ child: FbChildPaths.rawValue,
                    _ mediaContent: UIImageView,
                    _ caption: String,
                    _ completionHandler: CompletionHandler) {
        
        guard let user = currentUser,
            let image = mediaContent.image,
            let key = ref.value?.childByAutoId().key else { return }
        
        FirebaseHelper.addToStorage(user, image) { (urlString) in
            let post = Post(caption: caption, data: urlString, uid: user.uid, key: key)
            post.user = self.checkRealm(user.uid)
            
            guard let validPost = post.dictionary else { return}
            let childUpdate: [String:Any] = ["/posts/\(key)":validPost,
                               "/user-posts/\(user.uid)/\(key)":validPost]
            DatabaseRefs.parent.value?.updateChildValues(childUpdate)
            RealmService.shared.save(post)
        }

        completionHandler?()
    }
    
    //MIRTEST
    func checkRealm<T: Object>(_ key: String) -> T? {
        if let object = uiRealm.object(ofType: T.self, forPrimaryKey: key) {
            return object
        }
        return nil
    }
    
    func deleteData() {}
    
    ///MARK: ERROR HANDLING
}


