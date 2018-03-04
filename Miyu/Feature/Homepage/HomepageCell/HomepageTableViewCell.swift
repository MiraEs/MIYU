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

struct Rating {
    let count: Int
    let ratingScore: Double
}

class HomepageTableViewCell: UITableViewCell {
    
    private weak var fbManager = FirebaseUserManager.manager

    @IBOutlet weak var profileImage: UIImageView! {
        didSet {
            design()
        }
    }
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var ratingLabel: UILabel!
    @IBOutlet weak var captionLabel: UILabel!
    
    // TODO: this will change if video..
    @IBOutlet weak var contentImage: UIImageView!
    @IBOutlet weak var commentCaptionLabel: UILabel!
    @IBOutlet weak var commentCountLabel: UILabel!
    
    // TODO: Figure out model to obtain this data.
    @IBOutlet weak var recentCommentLabel: UILabel!
    
    @IBOutlet weak var ratingView: CosmosView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    
    }
    
    //MARK: SETUP
    func setupCell(_ uid: String) {
        if fbManager?.currentUser?.uid != uid {
            ratingView.isHidden = false
        } else {
            ratingView.isHidden = true
        }
    }
    func design() {
        profileImage.setRounded()
        nameLabel.largeFont()
        //ratingLabel.mediumFont()
        captionLabel.smallFont()
    }
    
    // MARK: RATING FUNCTIONALITY
    // TODO: firebase rating
    
    func ratingUpdate(_ rating: Double, _ key: String, _ uid: String) {
        print("updating rating....... with key \(key)")
        let ref = Database.database().reference()
        let usersRef = ref.child("posts")
        let postsRef = usersRef.child(key).child("rating")
        let userPostsRef = ref.child("user-posts").child(uid).child(key).child("rating")
        
        postsRef.setValue(rating)
        userPostsRef.setValue(rating)
        
        fbManager?.updatePostRatedCount(key)
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
