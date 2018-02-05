//
//  FirebaseUserManager.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import Firebase

internal final class FirebaseUserManager {
    
    static let manager = FirebaseUserManager()
    private init() {}
    
    func createUser(user: User) {
        guard let email = user.email,
            let password = user.password else {
                return
        }
        
        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if user != nil {
                print("successful user added \(user?.email!)")
            } else {
                print(error?.localizedDescription ?? "Unknown error")
            }
        })
    }
    
    func login(user: User) {
        guard let email = user.email,
            let password = user.password else {
                return
        }
        
        Auth.auth().signIn(withEmail: email, password: password) { (user, error) in
            if user != nil {
                print(user?.email)
            } else {
                print(error.debugDescription)
            }
        }
    }

    func signOut() {
        do {
            print("signing out \(String(describing: Auth.auth().currentUser?.email))")
            try Auth.auth().signOut()
        } catch let signOutError as NSError {
            print("Error signing out: %@", signOutError)
        }
    }
}
