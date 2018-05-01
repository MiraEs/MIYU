//
//  SettingsViewController.swift
//  
//
//  Created by Mira Estil on 5/1/18.
//

import UIKit

enum AppSettings: String {
    case activityRating
}

class SettingsViewController: BaseViewController {
    
    @IBOutlet weak var activityRatingSwitch: UISwitch!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.dismissView))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
        
        let result = UserDefaults.standard.bool(forKey: AppSettings.activityRating.rawValue)
        activityRatingSwitch.setOn(result, animated: true)
    }
    
    @objc func dismissView() {
        self.dismiss(animated: true, completion: nil)
    }

    @IBAction func activityRatingSwitch(_ sender: UISwitch) {
        print(sender.isOn)
        activityRatingSwitch.setOn(sender.isOn, animated: true)
        UserDefaults.standard.set(sender.isOn, forKey: AppSettings.activityRating.rawValue)
        
    }
}
