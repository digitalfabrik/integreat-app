// @flow

import integreatPlatformBuildConfigs from '../integreat'
import type {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'

const integreatTestCms = {
  appName: 'IntegreatTestCms',
  cmsUrl: 'https://cms-test.integreat-app.de',
  switchCmsUrl: 'https://cms.integreat-app.de',
  featureFlags: {
    pois: true,
    newsStream: true,
    pushNotifications: true,
    introSlides: true,
    jpalEvaluation: true,
    sentry: false,
    developerFriendly: true,
    fixedCity: null
  }
}

export const commonIntegreatTestCmsBuildConfig: CommonBuildConfigType = {
  ...integreatPlatformBuildConfigs.common,
  ...integreatTestCms
}

export const webIntegreatTestCmsBuildConfig: WebBuildConfigType = {
  ...integreatPlatformBuildConfigs.web,
  ...integreatTestCms
}

export const androidIntegreatTestCmsBuildConfig: AndroidBuildConfigType = {
  ...integreatPlatformBuildConfigs.android,
  ...integreatTestCms,
  applicationId: 'app.integreat.test',
  googleServices: {
    googleAppId: '1:164298278764:android:a0847ab9a13225b66fd549',
    gcmDefaultSenderId: '164298278764',
    defaultWebClientId: '164298278764-hhup7orh5rvg0oumhbabqvp5giudaste.apps.googleusercontent.com',
    gaTrackingId: null,
    firebaseDatabaseUrl: 'https://integreat-2020.firebaseio.com',
    googleApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    googleCrashReportingApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
    projectId: 'integreat-2020'
  }
}

export const iosIntegreatTestCmsBuildConfig: iOSBuildConfigType = {
  ...integreatPlatformBuildConfigs.ios,
  ...integreatTestCms,
  bundleIdentifier: 'app.integreat.test',
  provisioningProfileSpecifier: 'match Development app.integreat.test',
  googleServices: {
    clientId: '164298278764-e01c3b8l21nn6uot31vh82oohlf3672f.apps.googleusercontent.com',
    reversedClientId: 'com.googleusercontent.apps.164298278764-e01c3b8l21nn6uot31vh82oohlf3672f',
    apiKey: 'AIzaSyBSnGYrUWfIAPcEsFya1OYvTMbjvfUyOEU',
    gcmSenderId: '164298278764',
    plistVersion: '1',
    bundleId: 'app.integreat.test',
    projectId: 'integreat-2020',
    storageBucket: 'integreat-2020.appspot.com',
    isAdsEnabled: false,
    isAnalyticsEnabled: false,
    isAppInviteEnabled: true,
    isGCMEnabled: true,
    isSigninEnabled: true,
    googleAppId: '1:164298278764:ios:4e68482844682abb6fd549',
    databaseUrl: 'https://integreat-2020.firebaseio.com'
  }
}

const platformBuildConfigs = {
  common: commonIntegreatTestCmsBuildConfig,
  web: webIntegreatTestCmsBuildConfig,
  android: androidIntegreatTestCmsBuildConfig,
  ios: iosIntegreatTestCmsBuildConfig
}

export default platformBuildConfigs
