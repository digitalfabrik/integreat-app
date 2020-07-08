// @flow

import { lightTheme, darkTheme } from '../../themes/integreat'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'

const IntegreatBuildConfig: BuildConfigType = {
  appName: 'Integreat',
  lightTheme,
  darkTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
  featureFlags
}

module.exports = IntegreatBuildConfig
