//
//  Post.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

internal final class Post: Encodable {
    
    //private var title: String?
    var caption: String?
    var data: String?
    var averageRating: Double?
    var rating: Double?
    var key: String?
    var uid: String?
    var count: Int?
    
    enum CodingKeys: String, CodingKey {
        case caption, data, averageRating, uid, count, rating
    }

    
    init(rating: Double?, caption: String?, data: String?,
         uid: String?, count: Int?, averageRating: Double?) {
        self.rating = rating
        self.caption = caption
        self.data = data
        self.uid = uid
        self.count = count
        self.averageRating = averageRating
    }
}

extension Post: Decodable {
    convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let caption = try container.decode(String.self, forKey: .caption)
        let data = try container.decode(String.self, forKey: .data)
        let uid = try container.decode(String.self, forKey: .uid)
        let count = try container.decode(Int.self, forKey: .count)
        let averageRating = try container.decode(Double.self, forKey: .averageRating)
        let rating = try container.decode(Double.self, forKey: .rating)
        
        self.init(rating: rating, caption: caption, data: data, uid: uid,
                  count: count, averageRating: averageRating)
    }
}
