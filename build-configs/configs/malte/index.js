// @flow

import malteTheme, { darkTheme as darkMalteTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'

const MalteBuildConfig: BuildConfigType = {
  appName: 'Malteser',
  lightTheme: malteTheme,
  darkTheme: darkMalteTheme,
  cmsUrl: 'https://cms.malteapp.de',
  featureFlags
}

module.exports = MalteBuildConfig
