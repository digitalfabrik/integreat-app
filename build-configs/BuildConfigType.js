// @flow

import type { ThemeType } from './ThemeType'

export type LocalesType = { [namespace: string]: { [language: string]: { [key: string]: string } } }

export type FeatureFlagsType = {|
  pois: boolean,
  newsStream: boolean,
  pushNotifications: boolean,
  introSlides: boolean,
  sentry: boolean
|}

// These values can be retrieved from the google-services.json according to this guide:
// https://developers.google.com/android/guides/google-services-plugin#processing_the_json_file
type AndroidGoogleServicesConfig = {|
  googleAppId: string,
  gcmDefaultSenderId: string,
  defaultWebClientId: string,
  gaTrackingId: null | string,
  firebaseDatabaseUrl: string,
  googleApiKey: string,
  googleCrashReportingApiKey: string,
  projectId: string
|}

// These values can be retrieved from the GoogleService-Info.plist.
type iOSGoogleServicesConfig = {|
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

export type BuildConfigType = {|
  appName: string,
  appIcon: string,
  cmsUrl: string,
  switchCmsUrl?: string,
  shareBaseUrl: string,
  allowedHostNames: Array<string>,
  internalLinksHijackPattern: string,
  featureFlags: FeatureFlagsType,
  lightTheme: ThemeType,
  darkTheme: ThemeType,
  localesOverride?: LocalesType,
  assets: string,
  development: boolean,
  e2e?: boolean,
  mainImprint: string,
  aboutUrls: { default: string, [language: string]: string },
  privacyUrls: { default: string, [language: string]: string },
  android: {|
    splashScreen: boolean,
    applicationId: string,
    googleServices: ?AndroidGoogleServicesConfig
  |},
  ios: {|
    launchScreen: string,
    bundleIdentifier: string,
    provisioningProfileSpecifier: string,
    appleId: string,
    googleServices: ?iOSGoogleServicesConfig
  |},
  web: {|
    manifestUrl?: string,
    itunesAppId?: string,
    icons: {|
      appLogo: string,
      locationMarker: string,
      appleTouchIcon: string,
      favicons: string
    |},
    splashScreen?: {|
      backgroundColor: string,
      imageUrl: string
    |}
  |}
|}
