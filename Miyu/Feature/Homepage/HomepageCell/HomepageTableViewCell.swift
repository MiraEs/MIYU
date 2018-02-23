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
    
    func ratingUpdate(_ rating: Double, _ key: String) {
        //ratingView.didFinishTouchingCosmos = { rating in
            //print("did rate: \(rating)")
            self.updateRatingInFb(rating, key)
        //}
    }
    
    // TODO: firebase rating
    
    private func updateRatingInFb(_ rating: Double, _ key: String) {
        print("updating rating....... with key \(key)")
        //guard let uid = Auth.auth().currentUser?.uid else { return }
        let ref = Database.database().reference()
        let usersRef = ref.child("posts")
        let queryRef = usersRef.child(key).child("rating")
        
        print("query ref \(queryRef)")
        queryRef.setValue(rating)
        
        // need to update tableview?
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
