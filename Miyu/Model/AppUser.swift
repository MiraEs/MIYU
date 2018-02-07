//
//  User.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

/// AppUser class includes properties for AppUser object.
internal final class AppUser {
    
    private let fbManager: FirebaseUserManager?
    let email: String?
    let password: String?
    
    init(email: String, password: String) {
        self.email = email
        self.password = password
        self.fbManager = FirebaseUserManager.manager
    }
    
    
    func getUser() {
        fbManager?.getCurrentUserData()
    }
}
