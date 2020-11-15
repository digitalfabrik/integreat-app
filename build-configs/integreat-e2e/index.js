// @flow

import {
  WebIntegreatTestCmsBuildConfig,
  iOSIntegreatTestCmsBuildConfig,
  AndroidIntegreatTestCmsBuildConfig
} from '../integreat-test-cms'
import type { AndroidBuildConfigType, iOSBuildConfigType, WebBuildConfigType } from '../BuildConfigType'

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

const WebIntegreatE2eBuildConfig: WebBuildConfigType = { ...WebIntegreatTestCmsBuildConfig, ...IntegreatE2E }

const AndroidIntegreatE2eBuildCOnfig: AndroidBuildConfigType = {
  ...AndroidIntegreatTestCmsBuildConfig,
  ...IntegreatE2E,
  googleServices: null
}

const iOSIntegreatE2eBuildConfig: iOSBuildConfigType = {
  ...iOSIntegreatTestCmsBuildConfig,
  ...IntegreatE2E,
  googleServices: null
}

const platformBuildConfigs = {
  'web': WebIntegreatE2eBuildConfig,
  'android': AndroidIntegreatE2eBuildCOnfig,
  'ios': iOSIntegreatE2eBuildConfig,
}

export default platformBuildConfigs
