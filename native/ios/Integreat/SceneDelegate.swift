import React
import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
      let appDelegate = UIApplication.shared.delegate as? AppDelegate,
      let factory = appDelegate.reactNativeFactory
    else { return }

    let window = UIWindow(windowScene: windowScene)
    appDelegate.window = window
    self.window = window

    // RCTLinkingManager's getInitialURL() only reads this launchOptions dictionary
    // (captured once, here, at bridge creation) - it never sees scene(_:openURLContexts:)
    // or scene(_:continue:), which only fire while the JS bridge is already running.
    // Without this, a cold launch via integreat:// or a universal link opens the default screen.
    let initialURL =
      connectionOptions.urlContexts.first?.url
      ?? connectionOptions.userActivities.first(where: { $0.activityType == NSUserActivityTypeBrowsingWeb })?
      .webpageURL

    factory.startReactNative(
      withModuleName: "Integreat",
      in: window,
      launchOptions: initialURL.map { [UIApplication.LaunchOptionsKey.url: $0] }
    )
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else { return }
    RCTLinkingManager.application(UIApplication.shared, open: url, options: [:])
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    RCTLinkingManager.application(
      UIApplication.shared,
      continue: userActivity,
      restorationHandler: { _ in }
    )
  }
}
