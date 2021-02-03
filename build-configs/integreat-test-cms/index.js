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
    pushNotifications: false,
    introSlides: true,
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
  applicationId: 'de.integreat_test_cms',
  googleServices: {
    googleAppId: 'dummy',
    gcmDefaultSenderId: 'dummy',
    defaultWebClientId: 'dummy',
    gaTrackingId: null,
    firebaseDatabaseUrl: 'https://dummy',
    googleApiKey: 'dummyKey',
    googleCrashReportingApiKey: 'dummyKey',
    projectId: 'dummy'
  }
}

export const iosIntegreatTestCmsBuildConfig: iOSBuildConfigType = {
  ...integreatPlatformBuildConfigs.ios,
  ...integreatTestCms,
  bundleIdentifier: 'de.integreat_test_cms',
  googleServices: {
    clientId: 'dummy',
    reversedClientId: 'dummy',
    apiKey: 'dummy',
    gcmSenderId: 'dummy',
    plistVersion: '1',
    bundleId: 'de.integreat_test_cms',
    projectId: 'dummy',
    storageBucket: 'dummy',
    isAdsEnabled: false,
    isAnalyticsEnabled: false,
    isAppInviteEnabled: true,
    isGCMEnabled: true,
    isSigninEnabled: true,
    googleAppId: 'dummy',
    databaseUrl: 'https://dummy'
  }
}

const platformBuildConfigs = {
  common: commonIntegreatTestCmsBuildConfig,
  web: webIntegreatTestCmsBuildConfig,
  android: androidIntegreatTestCmsBuildConfig,
  ios: iosIntegreatTestCmsBuildConfig
}

export default platformBuildConfigs
