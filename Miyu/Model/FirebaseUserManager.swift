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
    
    var ref: DatabaseReference! {
        get {
            return Database.database().reference()
        }
    }
    
    var currentUser: User? {
        get {
            return Auth.auth().currentUser
        }
    }
    
    private init() {}
    
    func createUser(user: AppUser, userCredentials: UserCredential, handler: (() -> ())? = nil) {
        guard let email = userCredentials.email,
            let password = userCredentials.password,
            let userInfo = user.userInfo else {
                return
        }
        
    
        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if user != nil {
                
                self.ref.child("users").child((user!.uid)).setValue(userInfo)
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
    
    func getCurrentUserData() {
        guard let userID = Auth.auth().currentUser?.uid else { return }
        print("userID \(userID)")
        ref.child("users").child(userID).observeSingleEvent(of: .value, with: { (snapshot) in
            // Get user value
            //guard let value = snapshot.value as? NSDictionary else { return }
            //let firstName = value["firstName"] as? String ?? ""
            print("Snapshot \(snapshot)")

            // ...
        }) { (error) in
            print(error.localizedDescription)
        }
    }
}
