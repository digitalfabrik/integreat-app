// @flow

import IntegreatPlatformBuildConfigs from '../integreat'
import type {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'

const IntegreatTestCms = {
  appName: 'IntegreatTestCms',
  cmsUrl: 'https://cms-test.integreat-app.de',
  switchCmsUrl: 'https://cms.integreat-app.de',
  development: true,
  featureFlags: {
    pois: true,
    newsStream: true,
    pushNotifications: false,
    introSlides: true,
    sentry: false
  }
}

export const CommonIntegreatTestCmsBuildConfig: CommonBuildConfigType = {
  ...IntegreatPlatformBuildConfigs.common,
  ...IntegreatTestCms
}

export const WebIntegreatTestCmsBuildConfig: WebBuildConfigType = {
  ...IntegreatPlatformBuildConfigs.web,
  ...IntegreatTestCms
}

export const AndroidIntegreatTestCmsBuildConfig: AndroidBuildConfigType = {
  ...IntegreatPlatformBuildConfigs.android,
  ...IntegreatTestCms,
  googleServices: null
}

export const iOSIntegreatTestCmsBuildConfig: iOSBuildConfigType = {
  ...IntegreatPlatformBuildConfigs.ios,
  ...IntegreatTestCms,
  googleServices: null
}

const platformBuildConfigs = {
  common: CommonIntegreatTestCmsBuildConfig,
  web: WebIntegreatTestCmsBuildConfig,
  android: AndroidIntegreatTestCmsBuildConfig,
  ios: iOSIntegreatTestCmsBuildConfig,
}

export default platformBuildConfigs
