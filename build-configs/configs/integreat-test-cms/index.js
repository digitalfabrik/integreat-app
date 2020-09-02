// @flow

import IntegreatBuildConfig from '../integreat'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatTestCmsBuildConfig: () => BuildConfigType = () => ({
  ...IntegreatBuildConfig(),
  cmsUrl: 'https://cms-test.integreat-app.de'
})

module.exports = IntegreatTestCmsBuildConfig
