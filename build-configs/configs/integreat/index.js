// @flow

import integreatTheme, { darkTheme as darkIntegreatTheme } from '../../themes/integreat'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'

const IntegreatBuildConfig: BuildConfigType = {
  appTitle: 'Integreat',
  theme: integreatTheme,
  darkTheme: darkIntegreatTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  featureFlags
}

module.exports = IntegreatBuildConfig
