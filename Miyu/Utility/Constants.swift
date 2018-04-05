//
//  Constants.swift
//  Simi
//
//  Created by Mira Estil on 1/30/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

// MARK: FIREBASE

/// Enum for Firebase child paths - no cases used purely as namespace and to avoid uncessary instantiation
/// Discussion: https://stackoverflow.com/questions/38585344/swift-constants-struct-or-enum
enum FbChildPaths {
    typealias rawValue = String
    
    static let users = "users"
    static let posts = "posts"
    static let userPosts = "user-posts"
    static let userRatings = "user-ratings"
    static let userFriends = "user-friends"
}

enum PostKeys {
    
    static let count = "count"
    static let averageRating = "averageRating"
    static let rating = "rating"
}

// MARK: OTHER

internal final class Constants {
    
    // MARK: HOMEPAGE TABLE VIEW CELL
    static let homeCell = "homepageCell"
    static let homeXib = "HomepageTableViewCell"
    static let homeCellSegue = "otherProfile"
    
    // MARK: PROFILE FRIEND TABLE VIEW CELL
    static let friendCell = "friendCell"
    static let friendXib = "ContentFriendTableViewCell"
    
    // MARK: PROFILE TABLE VIEW CELL
    static let profileCell = "profileCell"
    static let profileXib = "ProfileTableViewCell"
    
    // MARK: PROFILE CUSTOM TAB VIEW & MENU BAR
    static let customCollectionCell = "customCollectionCell"
    static let menuBarCollectionCell = "menuBarCollectionCell"
    
    // MARK: CUSTOM TAB VIEW CELLS
    static let contentTableViewCell = "contentTableViewCell"
    static let contentCollectionViewCell = "contentCollectionViewCell"
    static let contentFriendCell = "contentFriendCell"
    
    // MARK: POST STRUCT KEYS
    static let postKeys: [String] = ["caption", "data", "rating", "uid", "count", "averageRating"]
    
}

