#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

#import <Firebase.h>
#import <FIROptions.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

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

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Integreat"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [self clearStorage];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)clearStorage
{
  NSUserDefaults *preferences = [NSUserDefaults standardUserDefaults];
  NSString *lastLanguageKey = @"last_location";

  if ([preferences objectForKey:lastLanguageKey] != nil)
  {
    //clear preferences
    [self resetDefaults];

    //clear storage
    [self removeCache];
  }
}

- (void)resetDefaults {
  NSUserDefaults * defs = [NSUserDefaults standardUserDefaults];
  NSDictionary * dict = [defs dictionaryRepresentation];
  for (id key in dict) {
    [defs removeObjectForKey:key];
  }
  [defs synchronize];
}

- (void)removeCache
{
  NSFileManager* manager = [NSFileManager defaultManager];
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
  NSString *libraryDirectory = [paths objectAtIndex:0];
  NSArray *directoryContent = [manager contentsOfDirectoryAtPath: libraryDirectory error:nil];
  for (NSString *content in directoryContent)  {
    NSString *path = [libraryDirectory stringByAppendingPathComponent:content];
    [manager removeItemAtPath:path error:nil];
  }
}

@end
