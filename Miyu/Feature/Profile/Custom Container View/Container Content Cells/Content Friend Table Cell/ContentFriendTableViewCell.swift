//
//  ContentFriendTableViewCell.swift
//  Miyu
//
//  Created by Mira Estil on 3/31/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class ContentFriendTableViewCell: UITableViewCell {

    @IBOutlet weak var friendName: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
