//
//  ContentFriendTableViewCell.swift
//  Miyu
//
//  Created by Mira Estil on 3/31/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class ContentFriendTableViewCell: UITableViewCell {
    
    @IBOutlet weak var profileImage: UIImageView! {
        didSet {
            profileImage.isUserInteractionEnabled = true
        }
    }
    @IBOutlet weak var friendName: UILabel!
    @IBOutlet weak var rating: UILabel!
    @IBOutlet weak var friendButton: UIButton!
    
    var friend: AppUser? {
        didSet {
            if let friend = friend {
                friendName.text = friend.firstName
            }
        }
    }
    var presentingVc: UINavigationController?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        profileImage.setRounded()
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }
    
    func setupTap(_ tag: Int) {
        profileImage.tag = tag
        let tapped = UITapGestureRecognizer(target: self, action: #selector(showUserProfile))
        tapped.numberOfTapsRequired = 1
        profileImage.addGestureRecognizer(tapped)
    }
    
    @objc func showUserProfile(gesture: UITapGestureRecognizer) {
        print("show user profile")
        let dvc = ProfileViewController.instantiate(fromAppStoryboard: .ProfileViewController)
        dvc.uid = self.friend?.keyUid
        dvc.isDiffOrigin = true
        if let pvc = self.presentingVc {
            pvc.pushViewController(dvc, animated: true)
        }
    }
    
    @IBAction func friendButtonTapped(_ sender: Any) {
        print("unfriend button tapped")
    }
}
