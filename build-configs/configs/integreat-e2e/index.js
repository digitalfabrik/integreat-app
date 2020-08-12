// @flow

import IntegreatTestCmsBuildConfig from '../integreat-test-cms'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatE2eBuildConfig: BuildConfigType = {
  ...IntegreatTestCmsBuildConfig,
  appName: 'IntegreatE2E',
  e2e: true,
  development: false,
  featureFlags: {
    pois: true,
    newsStream: true,
    introSlides: false
  },
  android: {
    applicationId: 'tuerantuer.app.integreat',
    googleServices: null
  },
  ios: {
    bundleIdentifier: 'de.integreat-app',
    googleServices: null
  }
}

module.exports = IntegreatE2eBuildConfig
