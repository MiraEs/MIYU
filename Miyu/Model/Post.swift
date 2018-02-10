//
//  Post.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

internal final class Post: NSObject {
    
    private var title: String?
    private var caption: String?
    private var data: String?
    
    init(title: String?, caption: String?, data: String?) {
        self.title = title
        self.caption = caption
        self.data = data
    }
}
