// @flow

import malteTheme, { darkTheme as darkMalteTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'

const MalteBuildConfig: BuildConfigType = {
  appTitle: 'Malteser',
  theme: malteTheme,
  darkTheme: darkMalteTheme,
  cmsUrl: 'https://cms.malteapp.de',
  featureFlags
}

module.exports = MalteBuildConfig
