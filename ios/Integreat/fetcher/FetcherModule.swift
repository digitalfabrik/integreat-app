import Foundation

@objc(FetcherModule)
class FetcherModule: RCTEventEmitter {
  override func supportedEvents() -> [String]! {
    return ["progress"]
  }
  
  private var count = 1
  
  @objc
  func fetchAsync(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    sendEvent(withName: "progress", body: count)
    
    if (count == 0) {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("E_COUNT", "count cannot be negative", error)
    } else {
      count -= 1
      resolve("count was decremented")
    }
  }
}
