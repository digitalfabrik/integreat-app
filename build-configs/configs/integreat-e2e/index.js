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
  }
}

module.exports = IntegreatE2eBuildConfig
