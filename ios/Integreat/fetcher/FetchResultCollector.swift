import Foundation
import os

class FetchResultCollector {
  var fetchResults = [String : FetchResult]()
  var resultQueue = DispatchQueue(label: "FetchResultQueue")
  
  var emitter: RCTEventEmitter
  var resolve: RCTPromiseResolveBlock
  var reject: RCTPromiseRejectBlock
  var expectedFetchCount: Int
  
  init(emitter: RCTEventEmitter, expectedFetchCount: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    self.emitter = emitter
    self.resolve = resolve
    self.reject = reject
    self.expectedFetchCount = expectedFetchCount
  }

  func failed(url: String, targetFile: URL, message: String) {
    resultQueue.async {
      self.fetchResults[targetFile.path] = FetchResult(url: url, lastUpdate: Date(), alreadyExisted: false, errorMessage: message)
      
      os_log("[%d/%d] Failed to download %s: %s", type: .info, self.currentFetchCount(), self.expectedFetchCount, url, message);
      
      self.sendProgress()
      self.tryToResolve()
    }
  }
  
  func fetched(url: String, targetFile: URL) {
    success(url: url, targetFile: targetFile, alreadyExisted: false);
  }
  
  func alreadyExists(url: String, targetFile: URL) {
    success(url: url, targetFile: targetFile, alreadyExisted: true);
  }

  func success(url: String, targetFile: URL, alreadyExisted: Bool) {
    resultQueue.async {
      self.fetchResults[targetFile.path] = FetchResult(url: url, lastUpdate: Date(),alreadyExisted: alreadyExisted, errorMessage: nil)
      
      os_log("[%d/%d] Downloaded a file: %s", type: .info, self.currentFetchCount(), self.expectedFetchCount, url);
      
      self.sendProgress();
      self.tryToResolve();
    }
  }
  
  func currentFetchCount() -> Int {
    return fetchResults.count
  }
  
  func tryToResolve() {
    if (currentFetchCount() != expectedFetchCount) {
      return;
    }
    
    var resolveValue = [String : [String : String]]()
    
    for (filePath, result) in fetchResults {
      var fetchResult = [String : String]()
      let dateTime = result.lastUpdate
      
      fetchResult["url"] = result.url
      
      if (result.alreadyExisted) {
        fetchResult["lastUpdate"] = dateTime.iso8601
      }
      
      if (result.errorMessage != nil) {
        fetchResult["errorMessage"] = result.errorMessage
      }
      
      resolveValue[filePath] = fetchResult
    }
    
    os_log("Resolving promise", type: .info)
    resolve(resolveValue)
  }
  
  func sendProgress() {
    emitter.sendEvent(withName: "progress", body: Double(fetchResults.count) / Double(expectedFetchCount))
  }
}
