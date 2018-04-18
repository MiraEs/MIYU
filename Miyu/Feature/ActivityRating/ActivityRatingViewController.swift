//
//  ActivityRatingViewController.swift
//  Miyu
//
//  Created by Mira Estil on 4/5/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class ActivityRatingViewController: UIViewController {
    
    var currentRating: Float = 4.234
    var arrRating = [Character]()
    var pickerData = [[String]]()
    let cellId = "cellId"
    let cellId2 = "cellId2"

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
        tableView.register(RatingCellView.self, forCellReuseIdentifier: cellId2)
       
        
        if pickerData.isEmpty {
            var tempArr = [String]()
            for i in 0...10 {
                tempArr.append(String(i))
            }
            pickerData.append(tempArr)
        }
        
        convertDecimalToString()
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
        return 2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        if indexPath.row == 0 {
            let cell = tableView.dequeueReusableCell(withIdentifier: cellId2, for: indexPath) as! RatingCellView
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: cellId, for: indexPath)
            return cell
        }
    }
}

/// custom cells

class RatingCellView: BaseTableCell {
    let label: UILabel = {
        let lb = UILabel()
        lb.text = "YOU'VE JUST BEEN RATED"
        return lb
    }()
    
    override func setupViews() {
        super.setupViews()
        addSubview(label)
        addConstraints(format: "H:[v0(50)]", views: label)
        addConstraints(format: "V:[v0(50)]", views: label)
        
        addConstraint(NSLayoutConstraint(item: label, attribute: .centerX, relatedBy: .equal, toItem: self, attribute: .centerX, multiplier: 1, constant: 0))
        addConstraint(NSLayoutConstraint(item: label, attribute: .centerY, relatedBy: .equal, toItem: self, attribute: .centerY, multiplier: 1, constant: 0))
    }
}


