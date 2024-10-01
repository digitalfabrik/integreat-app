#import "AppDelegate.h"
#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

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

  self.moduleName = @"Integreat";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// for deep linking
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

@end
