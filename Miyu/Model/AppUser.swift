//
//  User.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import RealmSwift

struct UserCredential {
    let email: String?
    let password: String?
}


enum AppUserKeys: String, CodingKey {
    case email, firstName, lastName, photoUrl, userRating
}
/// AppUser class includes properties for AppUser object.
final class AppUser: Object, Codable {

    @objc dynamic var email: String? = nil
    @objc dynamic  var firstName: String? = nil
    @objc dynamic var lastName: String? = nil
    @objc dynamic var photoUrl: String? = nil
    var userRating = RealmOptional<Double>()
    @objc dynamic var keyUid: String? = nil
    
    convenience init(firstName: String, lastName: String, email: String,
         photoUrl: String = "", userRating: Double = 5) {
        self.init()
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.photoUrl = photoUrl
        self.userRating.value = userRating
    }
    
    
    override static func primaryKey() -> String? {
        return "email"
    }
    
    // REALM
    func writeToRealm() {
        try! uiRealm.write {
            uiRealm.add(self, update: true)
        }
    }
}

extension AppUser {
    func encode(to encoder: Encoder) throws
    {
        var container = encoder.container(keyedBy: AppUserKeys.self)
        try container.encode(firstName, forKey: .firstName)
        try container.encode(lastName, forKey: .lastName)
        try container.encode(email, forKey: .email)
        try container.encode(userRating.value, forKey: .userRating)
        try container.encode(photoUrl, forKey: .photoUrl)
    }
}

extension AppUser {
    convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: AppUserKeys.self)
        let email = try container.decode(String.self, forKey: .email)
        let firstName = try container.decode(String.self, forKey: .firstName)
        let lastName = try container.decode(String.self, forKey: .lastName)
        let photoUrl = try container.decode(String.self, forKey: .photoUrl)
        let userRating = try container.decode(Double.self, forKey: .userRating)
        
        self.init(firstName: firstName, lastName: lastName,
                  email: email, photoUrl: photoUrl, userRating: userRating)
    }
}





