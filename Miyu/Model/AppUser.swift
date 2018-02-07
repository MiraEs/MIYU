//
//  User.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

internal protocol GetSnapshotProtocol {
    
}

struct UserCredential {
    let email: String?
    let password: String?
}

/// AppUser class includes properties for AppUser object.
internal final class AppUser {
    
    private let fbManager: FirebaseUserManager?
    private var email: String?
    private var firstName: String?
    private var lastName: String?
    private let photoUrl: String
    var userInfo: [String: String]?
    
    init(firstName: String, lastName: String, email: String) {
        self.fbManager = FirebaseUserManager.manager
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.photoUrl = "www.google.com"
        self.userInfo = self.createUser()
    }
    
    convenience init?(userDict: [String: String]) {
        if let firstName = userDict["firstName"],
            let lastName = userDict["lastName"],
            let email = userDict["email"] {
            self.init(firstName: firstName, lastName: lastName, email: email)
        } else {
            return nil
        }
    }
    
    private func createUser() -> [String: String]? {
        guard let email = email,
            let firstName = firstName,
            let lastName = lastName else {
                return [:]
        }
        
        let user: [String: String] = [
            "email" : email,
            "firstName" : firstName,
            "lastName" : lastName
        ]
        return user
    }
    
    func buildCurrentUser(_ snapshot: [String:String]) -> AppUser? {
        let user = AppUser.init(userDict: snapshot)
        return user
    }
    
    
}
