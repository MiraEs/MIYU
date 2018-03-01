//
//  User.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

struct UserCredential {
    let email: String?
    let password: String?
}

enum AppUserKeys: String, CodingKey {
    case email, firstName, lastName
}

enum AppUserKeysB: String, CodingKey {
    case email, firstName, lastName, photoUrl
}
/// AppUser class includes properties for AppUser object.
internal final class AppUser {
    
    //private let fbManager: FirebaseUserManager?
    private var email: String?
    private var firstName: String?
    private var lastName: String?
    var photoUrl: String?
    
    init(firstName: String, lastName: String, email: String) {
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.photoUrl = "www.google.com"
    }
    
    init(firstName: String, lastName: String, email: String, photoUrl: String) {
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.photoUrl = photoUrl
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
    
    func buildCurrentUser(_ snapshot: [String:String]) -> AppUser? {
        let user = AppUser.init(userDict: snapshot)
        return user
    }
}

extension AppUser: Encodable {
    func encode(to encoder: Encoder) throws
    {
        var container = encoder.container(keyedBy: AppUserKeys.self)
        try container.encode(firstName, forKey: .firstName)
        try container.encode(lastName, forKey: .lastName)
        try container.encode(email, forKey: .email)
    }
}


//case email, firstName, lastName, photoUrl
extension AppUser: Decodable {
    convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: AppUserKeysB.self)
        let email = try container.decode(String.self, forKey: .email)
        let firstName = try container.decode(String.self, forKey: .firstName)
        let lastName = try container.decode(String.self, forKey: .lastName)
        let photoUrl = try container.decode(String.self, forKey: .email)
        
        self.init(firstName: firstName, lastName: lastName, email: email, photoUrl: photoUrl)
    }
}


