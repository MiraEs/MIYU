//
//  RatedUserViewController.swift
//  Miyu
//
//  Created by Mira Estil on 4/18/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit
import Cosmos

class RatedUserViewController: UIViewController {
    
    private weak var fbManager = FirebaseUserManager.manager
    var userRated: AppUser?
    var rating: Double?
    @IBOutlet weak var ratingView: CosmosView! {
        didSet {
            ratingView.isUserInteractionEnabled = false
        }
    }
    @IBOutlet weak var ratingMessage: UILabel!
    @IBOutlet weak var userProfileImage: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        userProfileImage.setRounded()
        guard let currentUser = fbManager?.currentUser,
            let user = userRated?.firstName,
            let ratingNum = rating,
            let photoUrl = userRated?.photoUrl else {
                return
        }
        
        ratingView.rating = ratingNum
        fetchPhoto(photoUrl)
        
        if ratingNum == 1 {
            ratingMessage.text = "\(user) rated \(user) \(ratingNum) star"
        } else {
            ratingMessage.text = "\(user) rated \(user) \(ratingNum) stars"
        }
        
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.dismissView))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissView() {
        self.dismiss(animated: true, completion: nil)
    }
    
    private func fetchPhoto( _ profileUrlString: String) {
        userProfileImage.loadCachedImage(profileUrlString)
    }
    
}
