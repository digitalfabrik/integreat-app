import Foundation
import os

class FetchResultCollector {
  var fetchResults = [String : FetchResult]()

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

  
  // Synchronize
  func failed(url: String, targetFile: URL, message: String) {
    fetchResults[targetFile.path] = FetchResult(url: url, lastUpdate: Date(), alreadyExisted: false, errorMessage: message)
    
    #if DEBUG
      os_log("[%zd/%zd] Failed to fetch %s: %s", type: .debug, currentFetchCount(), expectedFetchCount, url, message);
    #endif
    
    sendProgress()
    tryToResolve()
  }
  
  func fetched(url: String, targetFile: URL) {
    success(url: url, targetFile: targetFile, alreadyExisted: false);
  }
  
  func alreadyExists(url: String, targetFile: URL) {
    success(url: url, targetFile: targetFile, alreadyExisted: true);
  }

  // Synchronize
  func success(url: String, targetFile: URL, alreadyExisted: Bool) {
    fetchResults[targetFile.path] = FetchResult(url: url, lastUpdate: Date(),alreadyExisted: alreadyExisted, errorMessage: nil)
    
    #if DEBUG
      os_log("[%zd/%zd] Downloaded a file: %s ", type: .debug, currentFetchCount(), expectedFetchCount, url);
    #endif
    sendProgress();
    tryToResolve();
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

    
    os_log("Resolving promise", type: .debug)
    resolve(resolveValue)
  }
  
  func sendProgress() {
    emitter.sendEvent(withName: "progress", body: Double(fetchResults.count) / Double(expectedFetchCount))
  }
}
