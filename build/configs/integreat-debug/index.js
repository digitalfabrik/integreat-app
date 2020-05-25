// @flow

import IntegreatAppConfig from '../integreat'
import type { AppConfigType } from '../AppConfigType'

const IntegreatAppDebugConfig: AppConfigType = {
  ...IntegreatAppConfig,
  cmsUrl: 'https://cms-test.integreat-app.de'
}

module.exports = IntegreatAppDebugConfig
