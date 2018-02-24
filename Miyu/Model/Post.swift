//
//  Post.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

internal final class Post: NSObject {
    
    //private var title: String?
     var caption: String?
     var data: String?
     var rating: Double?
    var key: String?
    var uid: String?
    
    init(rating: Double?, caption: String?, data: String?, key: String?, uid: String?) {
        self.rating = rating
        self.caption = caption
        self.data = data
        self.key = key
        self.uid = uid
    }
    
    // TODO: CREATE PROPER ERROR CATCH
    static func createPost(with dict: [String:AnyObject], key: String?) -> Post? {
        var validPost: Post?
        guard let caption = dict["caption"] as? String,
            let data = dict["data"] as? String,
            let rating = dict["rating"] as? Double,
            let uid = dict["uid"] as? String,
            let validKey = key else {
                return nil
           }
        
        validPost = Post(rating: rating, caption: caption, data: data, key: validKey, uid: uid)
        
        return validPost
    }
}
