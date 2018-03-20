//
//  DataStoreManager.swift
//  Miyu
//
//  Created by Mira Estil on 3/19/18.
//  Copyright © 2018 ME. All rights reserved.
//

import Foundation

class DataStoreManager {
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
                let data = try encoder.encode(objects as? [Post])
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
    
    /// REFACTOR
    
    static fileprivate func getDocDirectory() -> URL {
        if let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            return url
        } else {
            fatalError("UNABLE TO ACCESS DOC DIRECTORY")
        }
    }
    
    static func save<T:Encodable>(_ object: T, with fileName: String) {
        let url = getDocDirectory().appendingPathComponent(fileName, isDirectory: false)
        let encoder = JSONEncoder()
        
        do {
            let data = try encoder.encode(object)
            if FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.removeItem(at: url)
            }
            FileManager.default.createFile(atPath: url.path, contents: data, attributes: nil)
        } catch {
            fatalError(error.localizedDescription)
        }
    }
    
    static func load<T:Decodable>(_ fileName: String, with type: T.Type) -> T {
        let url = getDocDirectory().appendingPathComponent(fileName, isDirectory: false)
        if !FileManager.default.fileExists(atPath: url.path) {
            fatalError("FILE NOT FOUND AT PATH \(url.path)")
        }
        
        if let data = FileManager.default.contents(atPath: url.path) {
            do {
                let model = try JSONDecoder().decode(type, from: data)
                return model
            } catch {
                fatalError(error.localizedDescription)
            }
        } else {
            fatalError("NO DATA AVAILABLE AT PATH: \(url.path)")
        }
    }
    
    static func loadData(_ fileName: String) -> Data? {
        let url = getDocDirectory().appendingPathComponent(fileName, isDirectory: false)
        if !FileManager.default.fileExists(atPath: url.path) {
            fatalError("FILE NOT FOUND AT PATH: \(url.path)")
        }
        
        if let data = FileManager.default.contents(atPath: url.path) {
            return data
        } else {
            fatalError("DATA NOT AVAILABLE AT PATH: \(url.path)")
        }
    }
    
    static func loadAll<T:Decodable>(_ type: T.Type) -> [T] {
        do {
        let files = try FileManager.default.contentsOfDirectory(atPath: getDocDirectory().path)
        
        var modelObjects = [T]()
        for fileName in files {
            modelObjects.append(load(fileName, with: type))
        
        }
            return modelObjects
        } catch {
            fatalError("COULD NOT LOAD FILES")
        }
        
    }
    
    static func delete(_ fileName: String) {
        let url = getDocDirectory().appendingPathComponent(fileName, isDirectory: false)
        
        if FileManager.default.fileExists(atPath: url.path) {
            do {
                try FileManager.default.removeItem(at: url)
            } catch {
                fatalError(error.localizedDescription)
            }
        }
    }

}
