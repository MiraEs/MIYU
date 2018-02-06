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
    
    var currentUser: User? {
        get {
            return Auth.auth().currentUser
        }
    }
    
    var ref: DatabaseReference! {
        get {
            return Database.database().reference()
        }
    }
    
    private init() {}
    
    func createUser(user: AppUser, handler: (() -> ())? = nil) {
        guard let email = user.email,
            let password = user.password else {
                return
        }
        
        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if user != nil {
                print("successful user added \(email)")
                handler?()
            } else {
                // TODO: Create error alert class
                print(error?.localizedDescription ?? "Unknown error")
            }
        })
    }
    
    func login(user: AppUser, handler: (()->())? = nil) {
        guard let email = user.email,
            let password = user.password else {
                return
        }
        
        Auth.auth().signIn(withEmail: email, password: password) { (user, error) in
            if user != nil {
                handler?()
                print(email)
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
    
    
    func createProfile(_ user: AppUser) {
        //creates user
        //self.ref.child("users").child(user.uid).setValue(["username": username])
        let users: [String: Any] = [
            "firstName" : "Maria",
            "lastName" : "de la Cruz",
            "email" : user.email ?? "",
            "photo" : "www.google.com"
        ]
    self.ref.child("users").child((currentUser?.uid)!).setValue(users)
    }
    
    func getCurrentUserData() {
        let userID = Auth.auth().currentUser?.uid
        ref.child("users").child(userID!).observeSingleEvent(of: .value, with: { (snapshot) in
            // Get user value
            let value = snapshot.value as? NSDictionary
//            let username = value?["username"] as? String ?? ""
//            let user = AppUser(email: value?["email"], password: "")
            
            print("VALUE \(value)")
            
            // ...
        }) { (error) in
            print(error.localizedDescription)
        }
    }
    
}
