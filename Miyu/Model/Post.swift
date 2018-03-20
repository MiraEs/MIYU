//
//  Post.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

enum CodingKeys: String, CodingKey {
    case caption, data, averageRating, uid, count, rating, key
}

internal final class Post: Codable {
    
    //private var title: String?
    var caption: String?
    var data: String?
    var averageRating: Double?
    var rating: Double?
    var key: String?
    var uid: String?
    var count: Int?
    var user: AppUser?

    
    init(rating: Double?, caption: String?, data: String?,
         uid: String?, count: Int?, averageRating: Double?, key: String?) {
        self.rating = rating
        
        self.caption = caption
        self.data = data
        self.uid = uid
        self.count = count
        self.averageRating = averageRating
        self.key = key
    }
    
    init(caption: String?, data: String?, uid: String?, key: String?) {
        self.rating = 0.0
        self.averageRating = 0.0
        self.count = 0
        self.uid = uid
        self.data = data
        self.caption = caption
        self.key = key
    }
    
    func savePost() {
        DataStoreManager.save(self, with: key!)
        print("SAVING POST >>>>> \(self) with key: \(key)")
    }
    
    func deletePost() {
        DataStoreManager.delete(key!)
    }
    
}
// TODO: REFACTOR?
extension Post {
    convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let caption = try container.decode(String.self, forKey: .caption)
        let data = try container.decode(String.self, forKey: .data)
        let uid = try container.decode(String.self, forKey: .uid)
        let count = try container.decode(Int.self, forKey: .count)
        let averageRating = try container.decode(Double.self, forKey: .averageRating)
        let rating = try container.decode(Double.self, forKey: .rating)
        let key = try container.decode(String.self, forKey: .key)

        self.init(rating: rating, caption: caption, data: data, uid: uid,
                  count: count, averageRating: averageRating, key: key)
    }
}

