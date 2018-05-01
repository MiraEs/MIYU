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
    
    var post: Post? {
        didSet {
            if let post = post,
                let user = post.user,
                let count = post.count.value,
                let rating = post.rating.value,
                let userRating = user.userRating.value,
                let caption = post.caption {
                nameLabel.text = user.firstName ?? "NO NAME"
                commentCaption("star", count)
                ratingView.rating = rating
                userRatingLabel.text = "\(userRating)"
                captionLabel.text = caption
                uid = post.uid
            }
        }
    }
    
    
    var presentingVc: UINavigationController?
    var uid: String?
    
    private weak var fbManager = FirebaseUserManager.manager
    
    @IBOutlet weak var profileImage: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var captionLabel: UILabel!
    @IBOutlet weak var userRatingLabel: UILabel!
    // TODO: this will change if video..
    @IBOutlet weak var contentImage: UIImageView!
    @IBOutlet weak var commentCaptionLabel: UILabel!
    @IBOutlet weak var commentCountLabel: UILabel!
    
    // TODO: Figure out model to obtain this data.
    @IBOutlet weak var recentCommentLabel: UILabel!
    
    @IBOutlet weak var ratingView: CosmosView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        design()
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
        captionLabel.mediumFont()
        if let label = userRatingLabel {
            label.smallFont()
        }
        commentCaptionLabel.smallFont()
    }
    
    func commentCaption(_ imageName: String, _ cellCount: Int) {
        let imageAttachment = NSTextAttachment()
        imageAttachment.image = UIImage(named: imageName)
        imageAttachment.bounds = CGRect(x: 0, y: 1, width: (imageAttachment.image!.size.width)/2, height: (imageAttachment.image!.size.height)/2)
        
        
        let attachmentString = NSAttributedString(attachment: imageAttachment)
        let caption = NSMutableAttributedString(string: "\(cellCount) people have rated this.")
        caption.insert(attachmentString, at: 0)
        
        commentCaptionLabel.attributedText = caption
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
        print("clicked user for  \(String(describing: post?.user?.firstName))")
        
        if uid != fbManager?.currentUser?.uid {
            let dvc = ProfileViewController.instantiate(fromAppStoryboard: .ProfileViewController)
            dvc.uid = self.uid
            dvc.isDiffOrigin = true
            presentingVc?.pushViewController(dvc, animated: true)
        } else {
            presentingVc?.tabBarController?.selectedIndex = 2
        }
        
    }
}


