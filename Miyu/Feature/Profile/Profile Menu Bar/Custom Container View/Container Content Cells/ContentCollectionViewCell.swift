//
//  ContentCollectionViewCell.swift
//  Miyu
//
//  Created by Mira Estil on 3/23/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

/// Cell class for the container collection view cell where the user post data collection view is instantiated
class ContentCollectionViewCell: BaseCell {
    
    lazy var view: CustomTabView = {
        let view = CustomTabView()
        return view
    }()
    
    override func setupViews() {
        super.setupViews()
        
        addSubview(view)
        addConstraints(format: "H:|[v0]|", views: view)
        addConstraints(format: "V:|[v0]|", views: view)
        view.setupCollectionView()
    }
}
