//
//  FirebaseUserManager.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import Firebase

class User {
    let email: String?
    let password: String?
    
    init(email: String, password: String) {
        self.email = email
        self.password = password
    }
    
    func createUser() {
        
    }
}

enum FirebaseActionManager {
    case register, login, signout
}

internal final class FirebaseUserManager {
    
    static let manage = FirebaseUserManager()
    private init() {}
    
    func doAction(firebase action: FirebaseActionManager, user: User?) {
        guard let user = user else { return }
        
        switch action {
        case .login:
            login(user: user)
        case .register:
            createUser(user: user)
        case .signout:
            print("signout")
        default: break
        }
    }
    
    private func createUser(user: User) {
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
    
    private func login(user: User) {
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
}
