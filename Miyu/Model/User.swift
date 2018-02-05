//
//  User.swift
//  Miyu
//
//  Created by Mira Estil on 2/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

class User {
    let email: String?
    let password: String?
    
    init(email: String, password: String) {
        self.email = email
        self.password = password
    }
}
