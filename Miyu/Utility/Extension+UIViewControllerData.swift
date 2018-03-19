//
//  Extension+UIViewControllerData.swift
//  Miyu
//
//  Created by Mira Estil on 3/19/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

extension UIViewController {
    
    func saveData(_ objects: [AnyObject], store: DataStore, pathComponent: PathComponents) {
        let url = store.filePath.appendingPathComponent(pathComponent.rawValue)
        let encoder = JSONEncoder()
        switch pathComponent {
        case .postData:
                do {
                    let data = try encoder.encode(objects as? [Post])
                    try data.write(to: url, options: [])
                } catch {
                    fatalError(error.localizedDescription)
                }
        case .userData:
            do {
                let data = try encoder.encode(objects as? [AppUser])
                try data.write(to: url, options: [])
            } catch {
                fatalError(error.localizedDescription)
            }
        }
    }
    
    func loadPosts(_ store: DataStore, from path: PathComponents) -> [Post] {
        let url = store.filePath.appendingPathComponent(path.rawValue)
        let decoder = JSONDecoder()
        do {
            let data = try Data(contentsOf: url, options: [])
            let posts = try decoder.decode([Post].self, from: data)
            return posts
        } catch {
            fatalError(error.localizedDescription)
        }
    }
}
