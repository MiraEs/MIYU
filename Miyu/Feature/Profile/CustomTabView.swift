//
//  CustomTabView.swift
//  Miyu
//
//  Created by Mira Estil on 3/13/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

class CustomTabView: UIView, CustomTabViewDelegate {
    
    
    lazy var tableView: UITableView = {
        let table = UITableView(frame: .zero, style: .plain)
        table.delegate = self
        table.dataSource = self
        return table
    }()
    
    func tappedThat(_ viewInt: Int) {
        print("VIEWWW INTTT \(viewInt)")
        switch viewInt {
        case 0:
            collectionView.isHidden = true
            tableView.isHidden = false
        case 1:
            collectionView.isHidden = false
            tableView.isHidden = true
        default:
            break
        }
    }
    
    lazy var collectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        let cv = UICollectionView(frame: .zero, collectionViewLayout: layout)
        cv.dataSource = self
        cv.delegate = self
        return cv
    }()
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        setupTableView()
        setupCollectionView()
        collectionView.isHidden = true
    }
    
    func setupTableView() {
        addSubview(tableView)
        
        addConstraints(format: "H:|[v0]|", views: tableView)
        addConstraints(format: "V:|[v0]|", views: tableView)
        tableView.register(UINib(nibName: Constants.profileXib, bundle: nil),
                           forCellReuseIdentifier: Constants.profileCell)
        
    }
    
    func setupCollectionView() {
        collectionView.register(UICollectionViewCell.self, forCellWithReuseIdentifier: Constants.customCollectionCell)
        
        
        addSubview(collectionView)
        
        addConstraints(format: "H:|[v0]|", views: collectionView)
        addConstraints(format: "V:|[v0]|", views: collectionView)
    }
}

extension CustomTabView: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        //return userPosts.count
        return 3
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: Constants.profileCell, for: indexPath) as! ProfileTableViewCell
        cell.textLabel?.text = "LALALAL"
        return cell
    }
}

extension CustomTabView: UICollectionViewDataSource, UICollectionViewDelegateFlowLayout, UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return 4
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Constants.customCollectionCell, for: indexPath)
        cell.backgroundColor = UIColor.green
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        print("TAPPED IT AGAIN \(indexPath)")
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 0
    }
}

