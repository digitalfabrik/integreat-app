#import "AppDelegate.h"
#import <Firebase.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <React/RCTAppSetupUtils.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

static NSString *const kRNConcurrentRoot = @"concurrentRoot";

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([@BUILD_CONFIG_GOOGLE_SERVICES_GOOGLE_APP_ID length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_GCM_SENDER_ID length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_API_KEY length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_BUNDLE_ID length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_CLIENT_ID length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_PROJECT_ID length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_REVERSED_CLIENT_ID length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_DATABASE_URL length] > 0 &&
      [@BUILD_CONFIG_GOOGLE_SERVICES_STORAGE_BUCKET length] > 0) {
    FIROptions *options = [[FIROptions alloc]
                           initWithGoogleAppID:@BUILD_CONFIG_GOOGLE_SERVICES_GOOGLE_APP_ID
                           GCMSenderID:@BUILD_CONFIG_GOOGLE_SERVICES_GCM_SENDER_ID];
    if (options) {
      options.APIKey = @BUILD_CONFIG_GOOGLE_SERVICES_API_KEY;
      options.bundleID = @BUILD_CONFIG_GOOGLE_SERVICES_BUNDLE_ID;
      options.clientID = @BUILD_CONFIG_GOOGLE_SERVICES_CLIENT_ID;
      options.projectID = @BUILD_CONFIG_GOOGLE_SERVICES_PROJECT_ID;
      options.androidClientID = @BUILD_CONFIG_GOOGLE_SERVICES_REVERSED_CLIENT_ID;
      options.databaseURL = @BUILD_CONFIG_GOOGLE_SERVICES_DATABASE_URL;
      options.storageBucket = @BUILD_CONFIG_GOOGLE_SERVICES_STORAGE_BUCKET;

      // The following values are unset as they are probably not relevant for Messsaging:
      // options.deepLinkURLScheme = ??
      // options.trackingID = ??
      // options.appGroupID = ??

      // Unused info from GoogleService-Info.plist:
      // These existed in the .plist file but I was not able to add them to the FIROptions. They are probably not important.
      // ?? = BUILD_CONFIG_GOOGLE_SERVICES_PLIST_VERSION;
      // ?? = BUILD_CONFIG_GOOGLE_SERVICES_IS_ADS_ENABLED;
      // ?? = BUILD_CONFIG_GOOGLE_SERVICES_IS_ANALYTICS_ENABLED;
      // ?? = BUILD_CONFIG_GOOGLE_SERVICES_IS_APPINVITE_ENABLED;
      // ?? = BUILD_CONFIG_GOOGLE_SERVICES_IS_GCM_ENABLED;
      // ?? = BUILD_CONFIG_GOOGLE_SERVICES_IS_SIGNIN_ENABLED;

      [FIRApp configureWithOptions:options];
    }
  }
  RCTAppSetupPrepareApp(application);

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

#if RCT_NEW_ARCH_ENABLED
  _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
  _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
  _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
  _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
  bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
#endif

  NSDictionary *initProps = [self prepareInitialProps];
  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"Integreat", initProps);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feture is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  // Switch this bool to turn on and off the concurrent root
  return true;
}

- (NSDictionary *)prepareInitialProps
{
  NSMutableDictionary *initProps = [NSMutableDictionary new];

#ifdef RCT_NEW_ARCH_ENABLED
  initProps[kRNConcurrentRoot] = @([self concurrentRootEnabled]);
#endif

  return initProps;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end
