//
//  BaseCell.swift
//  Miyu
//
//  Created by Mira Estil on 3/11/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class BaseCell: UICollectionViewCell {
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    func setupViews() {}
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
