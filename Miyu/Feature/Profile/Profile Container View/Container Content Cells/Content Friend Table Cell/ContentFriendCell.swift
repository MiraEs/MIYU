//
//  ContentFriendCell.swift
//  Miyu
//
//  Created by Mira Estil on 3/31/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class ContentFriendCell: BaseCell, ProfileVcDelegate {
    
    var presentingVc: UINavigationController?
    
    lazy var view: ProfileContainerView = {
        let view = ProfileContainerView()
        return view
    }()
    
    override func setupViews() {
        super.setupViews()
        
        addSubview(view)
        addConstraints(format: "H:|[v0]|", views: view)
        addConstraints(format: "V:|[v0]|", views: view)
        view.setupFriendTableView()
        view.profileVcDelegate = self
    }
}
