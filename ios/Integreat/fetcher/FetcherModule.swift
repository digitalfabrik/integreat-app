import Foundation

@objc(FetcherModule)
class FetcherModule: RCTEventEmitter {
  override func supportedEvents() -> [String]! {
    return ["progress"]
  }
  
  private var count = 1
  
  @objc
  func fetchAsync(_ fetchMap: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let expectedFetchCount = fetchMap.count
    let collector = FetchResultCollector(
      emitter: self,
      expectedFetchCount: expectedFetchCount,
      resolve: resolve, reject: reject
    );
    
    for (targetFilePath, url) in fetchMap {
      //sendEvent(withName: "progress", body: url)
      fetchAsync(sourceUrl: String(describing: url), targetFilePath: String(describing: targetFilePath), collector: collector);
    }

    
    
    //if (count == 0) {
    //  let error = NSError(domain: "", code: 200, userInfo: nil)
    //  reject("E_COUNT", "count cannot be negative", error)
   // } else {
    //  count -= 1
    //  resolve("count was decremented")
    //}
  }
  
  func fetchAsync(sourceUrl: String, targetFilePath: String, collector: FetchResultCollector) {
    let targetFileURL = URL(string: targetFilePath)!
    
    let fileManager = FileManager.default
    
    if fileManager.fileExists(atPath: targetFileURL.path) {
      collector.alreadyExists(url: sourceUrl, targetFile: targetFileURL);
      return;
    }
    
    let downloadTask = URLSession.shared.downloadTask(with: URL(string: sourceUrl)!) {
      urlOrNil, responseOrNil, errorOrNil in
      
      guard let fileURL = urlOrNil else {
        let errorMessage = errorOrNil?.localizedDescription ?? "Failed to download because of unknown error!"
        
        collector.failed(url: sourceUrl, targetFile: targetFileURL, message: errorMessage)
        return
      }
      
      guard let response = responseOrNil else {
        collector.failed(url: sourceUrl, targetFile: targetFileURL, message: "Failed to download because of unkown error!")
        return
      }
      
      let statusCode = (response as? HTTPURLResponse)?.statusCode ?? -1
      
      if (statusCode != 200) {
        let statusMessage = HTTPURLResponse.localizedString(forStatusCode: statusCode)
        collector.failed(url: sourceUrl, targetFile: targetFileURL, message: "\(statusCode): \(statusMessage)")
        return
      }
      
      do {
        try fileManager.createDirectory(at: targetFileURL.deletingLastPathComponent(), withIntermediateDirectories: true)
                                                             
        try fileManager.moveItem(at: fileURL, to: targetFileURL)
      } catch {
        collector.failed(url: sourceUrl, targetFile: targetFileURL, message: error.localizedDescription)
      }
    }
    downloadTask.resume()
  }
}

