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
    case email, firstName, lastName, photoUrl
}
/// AppUser class includes properties for AppUser object.
internal final class AppUser {

    var email: String?
    var firstName: String?
    var lastName: String?
    var photoUrl: String?
    
    init(firstName: String, lastName: String, email: String, photoUrl: String = "") {
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.photoUrl = photoUrl
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

extension AppUser: Decodable {
    convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: AppUserKeys.self)
        let email = try container.decode(String.self, forKey: .email)
        let firstName = try container.decode(String.self, forKey: .firstName)
        let lastName = try container.decode(String.self, forKey: .lastName)
        let photoUrl = try container.decode(String.self, forKey: .photoUrl)
        
        self.init(firstName: firstName, lastName: lastName, email: email, photoUrl: photoUrl)
    }
}


