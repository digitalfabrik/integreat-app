// @flow

import { WebIntegreatBuildConfig, AndroidIntegreatBuildConfig, iOSIntegreatBuildConfig } from '../integreat'
import type { AndroidBuildConfigType, iOSBuildConfigType, WebBuildConfigType } from '../BuildConfigType'

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

export const WebIntegreatTestCmsBuildConfig: WebBuildConfigType = { ...WebIntegreatBuildConfig, ...IntegreatTestCms }

export const AndroidIntegreatTestCmsBuildConfig: AndroidBuildConfigType = {
  ...AndroidIntegreatBuildConfig,
  ...IntegreatTestCms,
  googleServices: null
}

export const iOSIntegreatTestCmsBuildConfig: iOSBuildConfigType = {
  ...iOSIntegreatBuildConfig,
  ...IntegreatTestCms,
  googleServices: null
}

const platformBuildConfigs = {
  'web': WebIntegreatTestCmsBuildConfig,
  'android': AndroidIntegreatTestCmsBuildConfig,
  'ios': iOSIntegreatTestCmsBuildConfig,
}

export default platformBuildConfigs
