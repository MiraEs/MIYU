//
//  RealmService.swift
//  Miyu
//
//  Created by Mira Estil on 4/22/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import RealmSwift

class RealmService {
    private init() {}
    
    static let shared = RealmService()
    //var realm = try! Realm()
    
    func save<T: Object>(_ object: T) {
        do {
            try uiRealm.write {
                uiRealm.add(object)
            }
        } catch {
            post(error)
        }
    }
    
    func update<T: Object>(_ object: T, with dictionary: [String: Any?]) {
        do {
            try uiRealm.write {
                for (key,value) in dictionary {
                    object.setValue(value, forKey: key)
                }
            }
        } catch {
            post(error)
        }
    }
    
    func delete<T: Object>(_ object: T) {
        do {
            try uiRealm.write {
                uiRealm.delete(object)
            }
        } catch {
            post(error)
        }
    }
    
    /// MARK: ERROR HANDLING
    func post(_ error: Error) {
        NotificationCenter.default.post(name: NSNotification.Name("RealmError"), object: error)
    }
    
    func observeRealmErrors(in vc: UIViewController, completion: @escaping (Error?)->Void) {
        NotificationCenter.default.addObserver(forName: NSNotification.Name("RealmError"), object: nil, queue: nil) { (notification) in
            completion(notification.object as? Error)
        }
    }
    
    func stopObservingErrors(in vc: UIViewController) {
        NotificationCenter.default.removeObserver(vc, name: NSNotification.Name("RealmError"), object: nil)
    }
}
