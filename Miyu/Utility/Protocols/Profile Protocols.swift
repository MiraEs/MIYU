//
//  Profile Protocols.swift
//  Miyu
//
//  Created by Mira Estil on 3/15/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

protocol CustomTabViewDelegate: class {
    func tappedThat(_ viewInt: Int)
}

protocol MenuScrollDelegate {
    func scrollToCell(_ indexPath: IndexPath)
}

protocol ProfileVcDelegate {
    var presentingVc: UIViewController? { get set }
}
