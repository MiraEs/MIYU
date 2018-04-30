//
//  DataStore.swift
//  Miyu
//
//  Created by Mira Estil on 3/18/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import RealmSwift

enum PathComponents: String {
    case postData = "postData"
    case userData = "userData"
}

internal final class DataStore {
    
    static let sharedInstance = DataStore()
    
    private init() {}
    
    var filePath: URL {
        let manager = FileManager.default
        let url = manager.urls(for: .documentDirectory, in: .userDomainMask).first
        print("URL PATH IN documentDirectory = \(String(describing: url))")
        return url!
    }
    
    var currentUser: AppUser?
    var userPosts: Results<Post>!
    var friends = [AppUser]()
    var ratedByUsers = [AppUser]()
}

