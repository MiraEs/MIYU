//
//  HomepageTableViewCell.swift
//  Simi
//
//  Created by Mira Estil on 1/30/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Cosmos
import Firebase

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
    
    // TODO: Capture rating data
    @IBOutlet weak var ratingView: CosmosView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    
    }
    
    // MARK: RATING FUNCTIONALITY
    
    func update(_ rating: Double) {
        ratingView.rating = rating
        print(rating)
    }
    
    // TODO: firebase rating
    private func addRating(_ rating: Double) {
        
    }
    
    func setupTap(_ tag: Int) {
        profileImage.isUserInteractionEnabled = true
        profileImage.tag = tag
        
        let tapped = UITapGestureRecognizer(target: self, action: #selector(showUserProfile))
        tapped.numberOfTapsRequired = 1
        profileImage.addGestureRecognizer(tapped)
    }
    
    @objc func showUserProfile(gesture: UITapGestureRecognizer) {
        print("it worked")
    }

    
}
