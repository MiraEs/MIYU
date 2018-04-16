//
//  ProfileContentCollectionViewCell.swift
//  Miyu
//
//  Created by Mira Estil on 3/23/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

/// Cell class for the collection view populating user data for Collection view cell
class ProfileContentCollectionViewCell: BaseCell {
    let imageView: UIImageView = {
        let iv = UIImageView()
        iv.autoresizingMask = [.flexibleWidth, .flexibleHeight, .flexibleBottomMargin,
                               .flexibleRightMargin, .flexibleLeftMargin, .flexibleTopMargin]
        iv.contentMode = .scaleAspectFit
        iv.clipsToBounds = true
        return iv
    }()
    
    override func setupViews() {
        super.setupViews()
        
        addSubview(imageView)
        addConstraints(format: "H:|[v0]|", views: imageView)
        addConstraints(format: "V:|[v0]|", views: imageView)
    }
}
