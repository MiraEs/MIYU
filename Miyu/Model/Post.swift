//
//  Post.swift
//  Miyu
//
//  Created by Mira Estil on 2/7/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

internal final class Post {
    
    private var title: String?
    private var caption: String?
    
    init(title: String?, caption: String?) {
        self.title = title
        self.caption = caption
    }
}
