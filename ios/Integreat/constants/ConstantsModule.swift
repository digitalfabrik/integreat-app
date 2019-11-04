//
//  ConstantsModule.swift
//  Integreat
//

import Foundation
@objc(RNNativeConstants)
class RNNativeConstants: NSObject {

  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
    return ["appVersion": appVersion]
  }
}
