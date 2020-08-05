// @flow

import IntegreatBuildConfig from '../integreat'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatTestCmsBuildConfig: BuildConfigType = {
  ...IntegreatBuildConfig,

  appName: 'IntegreatTestCms',
  cmsUrl: 'https://cms-test.integreat-app.de',
  switchCmsUrl: 'https://cms.integreat-app.de',
  development: true,
  featureFlags: {
    pois: true,
    newsStream: true,
    introSlides: true
  },
  android: {
    applicationId: 'app.integreat.test',
    googleServices: false
  },
  ios: {
    bundleIdentifier: 'app.integreat.test'
  }
}

module.exports = IntegreatTestCmsBuildConfig
