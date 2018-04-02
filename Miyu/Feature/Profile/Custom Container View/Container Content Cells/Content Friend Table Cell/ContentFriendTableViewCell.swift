//
//  ContentFriendTableViewCell.swift
//  Miyu
//
//  Created by Mira Estil on 3/31/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class ContentFriendTableViewCell: UITableViewCell {
    
    @IBOutlet weak var profileImage: UIImageView!
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
    
    override func awakeFromNib() {
        super.awakeFromNib()
        profileImage.setRounded()
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }
    
    @IBAction func friendButtonTapped(_ sender: Any) {
    }
}
