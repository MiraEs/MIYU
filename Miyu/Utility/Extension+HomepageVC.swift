//
//  Extension+HomepageVC.swift
//  Miyu
//
//  Created by Mira Estil on 4/4/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

extension HomepageViewController: UIBarPositioningDelegate {
    func positionForBar(bar: UIBarPositioning) -> UIBarPosition {
        return .topAttached
    }
}
