//
//  ActivityRatingViewController.swift
//  Miyu
//
//  Created by Mira Estil on 4/5/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class ActivityRatingViewController: UIViewController {
    
    var fbManager = FirebaseUserManager.manager
    var fbSerivce = FirebaseSerivce.shared
    private weak var store = DataStore.sharedInstance
    var currentRating: Float = 4.234
    var arrRating = [Character]()
    var pickerData = [[String]]()
    let cellId = "cellId"
    let cellId2 = "cellId2"
    
    
    // IMPLEMENT TABLEVIEW >> max 4
    // animate automatically each cell
    // audio needed
    let otherUsers = [AppUser]()

    @IBOutlet weak var arrow: UIImageView!
    @IBOutlet weak var topSeperatorView: UIView!
    @IBOutlet weak var bottomSeperatorView: UIView!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var tenthsPickerView: UIPickerView! {
        didSet {
            tenthsPickerView.isUserInteractionEnabled = true
        }
    }
    @IBOutlet weak var pickerView: UIPickerView! {
        didSet {
            pickerView.isUserInteractionEnabled = true
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        pickerView.delegate = self
        pickerView.dataSource = self
        tenthsPickerView.delegate = self
        tenthsPickerView.dataSource = self
        tableView.delegate = self
        tableView.dataSource = self
        
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: cellId)
        tableView.register(UINib(nibName: "ActivityTableViewCell", bundle: nil),forCellReuseIdentifier: cellId2)
       
        
        if pickerData.isEmpty {
            var tempArr = [String]()
            for i in 0...10 {
                tempArr.append(String(i))
            }
            pickerData.append(tempArr)
        }
        
        convertDecimalToString()
        
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.dismissView))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    
    //MARK: UTILITIES
    @objc func dismissView() {
        self.dismiss(animated: true, completion: nil)
    }
 
    
    private func convertDecimalToString() {
        arrRating = Array((String(currentRating)).components(separatedBy: ".").joined())
    }
    
    @IBAction func scrollTo(_ sender: UIButton) {
        let pickerViewValue = Int(String(arrRating[3]))
        let tenthsPickerViewValue = Int(String(arrRating[2]))
        
        let deadlineTime = DispatchTime.now() + .nanoseconds(1)
        let deadlineTime2 = DispatchTime.now() + .milliseconds(100)
        
        DispatchQueue.main.asyncAfter(deadline: deadlineTime) {
            self.pickerView.selectRow(pickerViewValue!, inComponent: 0, animated: true)
        }
        DispatchQueue.main.asyncAfter(deadline: deadlineTime2) {
            self.tenthsPickerView.selectRow(tenthsPickerViewValue!, inComponent: 0, animated: true)
        }
    }
 
    // MARK: DELEGATE/DATASOURCE
}

extension ActivityRatingViewController: UIPickerViewDataSource, UIPickerViewDelegate {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return pickerData.count
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return pickerData[component].count
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return pickerData[component][row]
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        pickerView.showsSelectionIndicator = false
    }
}

extension ActivityRatingViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = store?.ratedByUsers.count {
            return count
        }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
//        if indexPath.row == 0 {
//            let cell = tableView.dequeueReusableCell(withIdentifier: cellId2, for: indexPath) as! ActivityRatingCellView
//            return cell
//        } else {
//            let cell = tableView.dequeueReusableCell(withIdentifier: cellId, for: indexPath)
//
//            return celln
//        }
        guard let users = store?.ratedByUsers else { return UITableViewCell() }
        let cell = tableView.dequeueReusableCell(withIdentifier: cellId2, for: indexPath) as! ActivityTableViewCell
        if let user = users[indexPath.row]["user"] as? AppUser {
            cell.nameLabel.text = user.email
        }
        return cell
    }
}




