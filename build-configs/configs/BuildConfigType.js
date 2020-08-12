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

type AppleGoogleServicesConfig = {|
  CLIENT_ID: string,
  REVERSED_CLIENT_ID: string,
  API_KEY: string,
  GCM_SENDER_ID: string,
  PLIST_VERSION: string,
  BUNDLE_ID: string,
  PROJECT_ID: string,
  STORAGE_BUCKET: string,
  IS_ADS_ENABLED: boolean,
  IS_ANALYTICS_ENABLED: boolean,
  IS_APPINVITE_ENABLED: boolean,
  IS_GCM_ENABLED: boolean,
  IS_SIGNIN_ENABLED: boolean,
  GOOGLE_APP_ID: string,
  DATABASE_URL: string
|}

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
    googleServices: ?AppleGoogleServicesConfig
  |}
|}
