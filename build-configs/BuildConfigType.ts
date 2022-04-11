import { TranslationsType } from 'translations'

import { ThemeType } from './ThemeType'

// Build Configs
// These are the types of our build configs and therefore define the structure and available options.
// Each build config (e.g. integreat, malte) is available per platform (android, ios, web) with some shared options.
// Feature flags are boolean build config options defining whether a specified feature is enabled.
// Prevent enabled intro slide in combination with a fixed city.
// If you change this make sure you are not navigating to the landing screen upon closing the intro slides.
export type FixedCityType =
  | {
      // Shows intro slides to the users on first app start.
      introSlides: false
      // Preselects a city without showing a selection, changing it is not possible for users.
      fixedCity: string | null
    }
  | {
      introSlides: true
      fixedCity: null
    }

export type FeatureFlagsType = FixedCityType & {
  // Whether the build should be floss. If set to true, proprietary libraries and features like firebase are stripped.
  floss: boolean
  // Enables POIs and maps, can be disabled via our api on a per city basis.
  pois: boolean
  // Enables local news and tünews, can be disabled via our api on a per city basis.
  newsStream: boolean
  // Enables firebase push notifications, can be disabled by users.
  pushNotifications: boolean
  // Enables tracking campaign for the jpal evaluation.
  jpalTracking: boolean
  // Enables error tracking to sentry, can be disabled by users.
  sentry: boolean
  // Enables additional debugging output for devs (i18n, redux, hidden cities, version).
  developerFriendly: boolean
  // Enables the option for users to suggest Integreat to their city and uses this template for the suggestion
  cityNotCooperating?: boolean
  cityNotCooperatingTemplate: string | null
}

// Available on all platforms
export type CommonBuildConfigType = {
  appName: string
  appIcon: string
  cmsUrl: string
  // Secondary api url to use, selectable by clicking ten times on the location marker (works only on native).
  switchCmsUrl?: string
  // Host name of the web app, used for sharing, deep linking and social media previews.
  hostName: string
  // Hostnames from which resources are automatically downloaded for offline usage.
  allowedHostNames: Array<string>
  // Regex defining which urls to intercept as they are internal ones.
  internalLinksHijackPattern: string
  featureFlags: FeatureFlagsType
  lightTheme: ThemeType
  // Translations deviating from the standard integreat translations.
  translationsOverride?: TranslationsType
  // Assets like icons, logos and imprints.
  assets: string
  // Whether the build config is used for e2e tests.
  e2e?: boolean
  // Urls with (localized) information about the app.
  aboutUrls: {
    default: string
    [language: string]: string
  }
  // Urls with (localized) privacy information.
  privacyUrls: {
    default: string
    [language: string]: string
  }
}
// Available only on web
export type WebBuildConfigType = CommonBuildConfigType & {
  // Used for generating manifest.json
  appDescription: string
  // Main imprint of the app.
  mainImprint: string
  // Url to the manifest.json generated with webpack.
  manifestUrl?: string
  // Id of the corresponding iOS app in the Apple App Store.
  itunesAppId?: string
  icons: {
    appLogo: string
    locationMarker?: string
    cityNotCooperating?: string
    appleTouchIcon: string
    socialMediaPreview: string
    favicons: string
  }
  splashScreen?: {
    // Splash screen showed before the web app has been loaded.
    backgroundColor: string
    imageUrl: string
  }
  campaign?: {
    // Shows a different app logo from start to end date.
    campaignAppLogo: string
    startDate: string
    endDate: string
  }
}

// Firebase config for android
// These values can be retrieved from the google-services.json according to this guide:
// https://developers.google.com/android/guides/google-services-plugin#processing_the_json_file
type AndroidGoogleServicesConfigType = {
  googleAppId: string
  gcmDefaultSenderId: string
  defaultWebClientId: string
  gaTrackingId: null | string
  firebaseDatabaseUrl: string
  googleApiKey: string
  googleCrashReportingApiKey: string
  projectId: string
}

// Only available on android
export type AndroidBuildConfigType = CommonBuildConfigType & {
  splashScreen: boolean
  // Shows the app icon as splash screen on app start.
  applicationId: string
  // SHA-256 certificate fingerprint of the app signing key certificate
  sha256CertFingerprint: string
  // Android application identifier.
  googleServices: AndroidGoogleServicesConfigType | null
}

// Firebase config for iOS
// These values can be retrieved from the GoogleService-Info.plist.
type iOSGoogleServicesConfigType = {
  clientId: string
  reversedClientId: string
  apiKey: string
  gcmSenderId: string
  plistVersion: string
  bundleId: string
  projectId: string
  storageBucket: string
  isAdsEnabled: boolean
  isAnalyticsEnabled: boolean
  isAppInviteEnabled: boolean
  isGCMEnabled: boolean
  isSigninEnabled: boolean
  googleAppId: string
  databaseUrl: string
}

// Only available on iOS
export type iOSBuildConfigType = CommonBuildConfigType & {
  // Shows the app icon as launch screen on app start.
  launchScreen: string
  // iOS application identifier.
  bundleIdentifier: string
  // Provisioning profile to sign the app.
  provisioningProfileSpecifier: string
  // Id of the app in the Apple App Store
  appleId: string
  // Unique generated app name of apple, used for generating manifest
  itunesAppName: string
  // Apple app site association app ids, used for apple-app-site-association
  appleAppSiteAssociationAppIds: string[]
  googleServices: iOSGoogleServicesConfigType | null | undefined
}
