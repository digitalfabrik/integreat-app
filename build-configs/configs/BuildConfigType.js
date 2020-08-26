// @flow

import type { ThemeType } from '../themes/ThemeType'

export type FeatureFlagsType = {|
  pois: boolean,
  newsStream: boolean,
  introSlides: boolean
|}

type AndroidGoogleServicesConfig = {|
  google_app_id: string,
  gcm_defaultSenderId: string,
  default_web_client_id: string,
  ga_trackingId: null | string,
  firebase_database_url: string,
  google_api_key: string,
  google_crash_reporting_api_key: string,
  project_id: string
|}

type iOSGoogleServicesConfig = {
  clientId: string,
  reverseClientId: string,
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
}
export type BuildConfigType = {|
  appName: string,
  cmsUrl: string,
  switchCmsUrl?: string,
  allowedHostNames: Array<string>,
  featureFlags: FeatureFlagsType,
  lightTheme: ThemeType,
  darkTheme: ThemeType,
  development?: boolean,
  e2e?: boolean,
  android: {|
    applicationId: string,
    // According to https://developers.google.com/android/guides/google-services-plugin#processing_the_json_file
    googleServices: ?AndroidGoogleServicesConfig
  |},
  ios: {|
    bundleIdentifier: string,
    googleServices: ?iOSGoogleServicesConfig
  |}
|}
