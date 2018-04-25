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


class FirebaseSerivce {
    private init() {}
    static let shared = FirebaseSerivce()
    
    func getAllData<T: Object>(_ ref: DatabaseReference,
                            _ anyObject: T,
                            _ completionHandler: @escaping ()->Void) {
        ref.queryLimited(toLast:100).observeSingleEvent(of: .value) { (snapshot) in
            let snaps = snapshot.children
            while let object = snaps.nextObject() as? DataSnapshot {
                do {
                    if let value = object.value {
                        let data = try JSONSerialization.data(withJSONObject: value, options: [])
                        let validDataObject = try JSONDecoder().decode(T.self, from: data)
                        completionHandler(validDataObject)
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
