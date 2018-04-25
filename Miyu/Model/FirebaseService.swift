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

enum DatabaseRef {
    
    case posts
    //case users = Database.database().reference()
    
    var value: DatabaseReference? {
        switch self {
        case .posts:
            return Database.database().reference().child(FbChildPaths.posts)
        }
    }
}

class FirebaseSerivce {
    private init() {}
    static let shared = FirebaseSerivce()
    
    func getAllData<T: Codable>(_ ref: DatabaseRef,
                            _ anyObject: T.Type,
                            _ completionHandler: @escaping (Object)->Void) {
        ref.value?.queryLimited(toLast:100).observeSingleEvent(of: .value) { (snapshot) in
            let snaps = snapshot.children
            while let object = snaps.nextObject() as? DataSnapshot {
                do {
                    if let value = object.value {
                        let data = try JSONSerialization.data(withJSONObject: value, options: [])
                        let validDataObject = try JSONDecoder().decode(anyObject, from: data)
                        completionHandler(validDataObject as! Object)
                    }
                } catch {
                    print(error)
                }
            }
        }
    }
    
    func getData() {}
    
    func updateData() {}
    
    func deleteData() {}
    
    
    ///MARK: ERROR HANDLING
}
