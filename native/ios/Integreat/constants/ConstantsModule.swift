//
//  ConstantsModule.swift
//  Integreat
//

import Foundation
@objc(RNNativeConstants)
class RNNativeConstants: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
    return ["appVersion": appVersion]
  }
}
