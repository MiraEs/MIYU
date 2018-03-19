//
//  Extension+UIViewControllerData.swift
//  Miyu
//
//  Created by Mira Estil on 3/19/18.
//  Copyright © 2018 ME. All rights reserved.
//

import UIKit

extension UIViewController {
    
    
    func saveData(_ posts: [Post], store: DataStore, pathComponent: PathComponents) {
        let url = store.filePath.appendingPathComponent(pathComponent.rawValue)
        let encoder = JSONEncoder()
        do {
            let data = try encoder.encode(posts)
            try data.write(to: url, options: [])
        } catch {
            fatalError(error.localizedDescription)
        }
    }
    
    func loadData(_ store: DataStore, pathComponent: PathComponents) -> [Post] {
        let url = store.filePath.appendingPathComponent(pathComponent.rawValue)
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
