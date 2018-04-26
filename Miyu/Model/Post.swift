//
//  Post.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation
import RealmSwift

enum CodingKeys: String, CodingKey {
    case caption, data, averageRating, uid, count, rating, key
}

internal final class Post: Object, Codable {
    
    @objc dynamic var caption: String? = nil
    @objc dynamic  var data: String? = nil
    var averageRating = RealmOptional<Double>()
    var rating = RealmOptional<Double>()
    @objc dynamic var uid: String? = nil
    var count = RealmOptional<Int>()
    
    @objc dynamic var key: String? = nil
    @objc dynamic var user: AppUser?

    
    required convenience init(rating: Double?, caption: String?, data: String?,
         uid: String?, count: Int?, averageRating: Double?, key: String?) {
        self.init()
        self.rating.value = rating
        self.caption = caption
        self.data = data
        self.uid = uid
        self.count.value = count
        self.averageRating.value = averageRating
        self.key = key
    }
    
    convenience init(caption: String?, data: String?, uid: String?, key: String?) {
        self.init()
        self.rating.value = 0.0
        self.averageRating.value = 0.0
        self.count.value = 0
        self.uid = uid
        self.data = data
        self.caption = caption
        self.key = key
    }
    
    override static func primaryKey() -> String? {
        return "key"
    }
    
    // REALM
    func writeToRealm() {
        try! uiRealm.write {
            uiRealm.add(self, update: true)
        }
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

extension Post {
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(caption, forKey: .caption)
        try container.encode(data, forKey: .data)
        try container.encode(uid, forKey: .uid)
        try container.encode(count.value, forKey: .count)
        try container.encode(averageRating.value, forKey: .averageRating)
        try container.encode(rating.value, forKey: .rating)
        try container.encode(key, forKey: .key)
    }
}

