// @flow

import type { ThemeType } from './ThemeType'
import type { TranslationsType } from 'translations'

// Build Configs
// These are the flow types of our build configs and therefore define the structure and available options.
// Each build config (e.g. integreat, malte) is available per platform (android, ios, web) with some shared options.
// Feature flags are boolean build config options defining whether a specified feature is enabled.

// Prevent enabled intro slide in combination with a fixed city.
// If you change this make sure you are not navigating to the landing screen upon closing the intro slides.
export type FixedCityType = {|
  introSlides: false, // Shows intro slides to the users on first app start.
  fixedCity: string | null // Preselects a city without showing a selection, changing it is not possible for users.
|} | {|
  introSlides: true,
  fixedCity: null
|}

export type FeatureFlagsType = {|
  ...FixedCityType,
  pois: boolean, // Enables POIs and maps, can be disabled via our api on a per city basis.
  newsStream: boolean, // Enables local news and tünews, can be disabled via our api on a per city basis.
  pushNotifications: boolean, // Enables firebase push notifications, can be disabled by users.
  sentry: boolean, // Enables error tracking to sentry, can be disabled by users.
  developerFriendly: boolean // Enables additional debugging output for devs (i18n, redux, hidden cities, version).
|}

// Available on all platforms
export type CommonBuildConfigType = {|
  appName: string,
  appIcon: string,
  cmsUrl: string,
  // Secondary api url to use, selectable by clicking ten times on the location marker (works only on native).
  switchCmsUrl?: string,
  shareBaseUrl: string, // Base url of the web app, used for correct share urls.
  allowedHostNames: Array<string>, // Hostnames from which resources are automatically downloaded for offline usage.
  internalLinksHijackPattern: string, // Regex defining which urls to intercept as they are internal ones.
  featureFlags: FeatureFlagsType,
  lightTheme: ThemeType,
  darkTheme: ThemeType,
  translationsOverride?: TranslationsType, // Translations deviating from the standard integreat translations.
  assets: string, // Assets like icons, logos and imprints.
  e2e?: boolean, // Whether the build config is used for e2e tests.
  aboutUrls: { default: string, [language: string]: string }, // Urls with (localized) information about the app.
  privacyUrls: { default: string, [language: string]: string } // Urls with (localized) privacy information.
|}

// Available only on web
export type WebBuildConfigType = {|
  ...CommonBuildConfigType,
  mainImprint: string, // Main imprint of the app.
  manifestUrl?: string, // Url to the manifest.json.
  itunesAppId?: string, // Id of the corresponding iOS app in the Apple App Store.
  icons: {|
    appLogo: string,
    locationMarker?: string,
    appleTouchIcon: string,
    socialMediaPreview: string,
    favicons: string
  |},
  splashScreen?: {| // Splash screen showed before the web app has been loaded.
    backgroundColor: string,
    imageUrl: string
  |}
|}

// Firebase config for android
// These values can be retrieved from the google-services.json according to this guide:
// https://developers.google.com/android/guides/google-services-plugin#processing_the_json_file
type AndroidGoogleServicesConfigType = {|
  googleAppId: string,
  gcmDefaultSenderId: string,
  defaultWebClientId: string,
  gaTrackingId: null | string,
  firebaseDatabaseUrl: string,
  googleApiKey: string,
  googleCrashReportingApiKey: string,
  projectId: string
|}

// Only available on android
export type AndroidBuildConfigType = {|
  ...CommonBuildConfigType,
  splashScreen: boolean, // Shows the app icon as splash screen on app start.
  applicationId: string, // Android application identifier.
  googleServices: ?AndroidGoogleServicesConfigType
|}

// Firebase config for iOS
// These values can be retrieved from the GoogleService-Info.plist.
type iOSGoogleServicesConfigType = {|
  clientId: string,
  reversedClientId: string,
  apiKey: string,
  gcmSenderId: string,
  plistVersion: string,
  bundleId: string,
  projectId: string,
  storageBucket: string,
  isAdsEnabled: boolean,
  isAnalyticsEnabled: boolean,
  isAppInviteEnabled: boolean,
  isGCMEnabled: boolean,
  isSigninEnabled: boolean,
  googleAppId: string,
  databaseUrl: string
|}

// Only available on iOS
export type iOSBuildConfigType = {|
  ...CommonBuildConfigType,
  launchScreen: string, // Shows the app icon as launch screen on app start.
  bundleIdentifier: string, // iOS application identifier.
  provisioningProfileSpecifier: string, // Provisioning profile to sign the app.
  appleId: string, // Id of the app in the Apple App Store
  googleServices: ?iOSGoogleServicesConfigType
|}
