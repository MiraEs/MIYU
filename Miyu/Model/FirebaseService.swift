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
    
    case posts
    case users
    case user(uid: String)
    
    var value: DatabaseReference? {
        let ref = Database.database().reference()
        switch self {
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
    static let shared = FirebaseSerivce()
    
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
    
    func updateData() {}
    
    func deleteData() {}
    
    
    ///MARK: ERROR HANDLING
}
