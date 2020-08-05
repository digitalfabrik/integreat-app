// @flow

import IntegreatBuildConfig from '../integreat'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatTestCmsBuildConfig: BuildConfigType = {
  ...IntegreatBuildConfig,
  applicationId: 'app.integreat.test',
  appName: 'IntegreatTestCms',
  cmsUrl: 'https://cms-test.integreat-app.de',
  switchCmsUrl: 'https://cms.integreat-app.de',
  development: true,
  featureFlags: {
    pois: true,
    newsStream: true,
    introSlides: true
  }
}

module.exports = IntegreatTestCmsBuildConfig
