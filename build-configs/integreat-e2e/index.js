// @flow

import IntegreatTestCmsPlatformBuildConfigs from '../integreat-test-cms'
import type {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'

const IntegreatE2E = {
  appName: 'IntegreatE2E',
  e2e: true,
  development: false,
  featureFlags: {
    pois: true,
    newsStream: true,
    pushNotifications: false,
    introSlides: false,
    sentry: false
  }
}

const CommonIntegreatE2eBuildConfig: CommonBuildConfigType = {
  ...IntegreatTestCmsPlatformBuildConfigs.common,
  ...IntegreatE2E
}

const WebIntegreatE2eBuildConfig: WebBuildConfigType = {
  ...IntegreatTestCmsPlatformBuildConfigs.web,
  ...IntegreatE2E
}

const AndroidIntegreatE2eBuildCOnfig: AndroidBuildConfigType = {
  ...IntegreatTestCmsPlatformBuildConfigs.android,
  ...IntegreatE2E,
  googleServices: null
}

const iOSIntegreatE2eBuildConfig: iOSBuildConfigType = {
  ...IntegreatTestCmsPlatformBuildConfigs.ios,
  ...IntegreatE2E,
  googleServices: null
}

const platformBuildConfigs = {
  common: CommonIntegreatE2eBuildConfig,
  web: WebIntegreatE2eBuildConfig,
  android: AndroidIntegreatE2eBuildCOnfig,
  ios: iOSIntegreatE2eBuildConfig,
}

export default platformBuildConfigs
