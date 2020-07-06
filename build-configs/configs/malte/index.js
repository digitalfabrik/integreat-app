// @flow

import { lightTheme, darkTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'

const MalteBuildConfig: BuildConfigType = {
  appName: 'Malteser',
  lightTheme,
  darkTheme,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  featureFlags
}

module.exports = MalteBuildConfig
