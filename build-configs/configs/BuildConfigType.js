// @flow

import type { ThemeType } from '../themes/ThemeType'

export type FeatureFlagsType = {|
  pois: boolean,
  newsStream: boolean,
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
  cmsUrl: string,
  switchCmsUrl?: string,
  shareBaseUrl: string,
  allowedHostNames: Array<string>,
  featureFlags: FeatureFlagsType,
  lightTheme: ThemeType,
  darkTheme: ThemeType,
  iconSet: string,
  development: boolean,
  e2e?: boolean,
  android: {|
    applicationId: string,
    googleServices: ?AndroidGoogleServicesConfig
  |},
  ios: {|
    bundleIdentifier: string,
    provisioningProfileSpecifier: string,
    googleServices: ?iOSGoogleServicesConfig
  |}
|}
