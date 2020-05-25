// @flow

import IntegreatAppConfig from '../integreat'
import type { AppConfigType } from '../AppConfigType'

const IntegreatAppDebugConfig: AppConfigType = {
  cmsUrl: 'https://cms-test.integreat-app.de',
  ...IntegreatAppConfig
}

module.exports = IntegreatAppDebugConfig
