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
    selectedCity: null
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
  googleServices: null
}

export const iosIntegreatTestCmsBuildConfig: iOSBuildConfigType = {
  ...integreatPlatformBuildConfigs.ios,
  ...integreatTestCms,
  bundleIdentifier: 'de.integreat_test_cms',
  googleServices: null
}

const platformBuildConfigs = {
  common: commonIntegreatTestCmsBuildConfig,
  web: webIntegreatTestCmsBuildConfig,
  android: androidIntegreatTestCmsBuildConfig,
  ios: iosIntegreatTestCmsBuildConfig
}

export default platformBuildConfigs
