//
//  HomepageTableViewCell.swift
//  Simi
//
//  Created by Mira Estil on 1/30/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class HomepageTableViewCell: UITableViewCell {

    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var ratingLabel: UILabel!
    
    @IBOutlet weak var captionLabel: UILabel!
    
    // TODO: this will change if video..
    @IBOutlet weak var contentImage: UIImageView!
    @IBOutlet weak var commentCaptionLabel: UILabel!
    @IBOutlet weak var commentCountLabel: UILabel!
    
    // TODO: Figure out model to obtain this data.
    @IBOutlet weak var recentCommentLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        setup()
    }
    
    private func setup() {
        // Round image
    }

    
}
