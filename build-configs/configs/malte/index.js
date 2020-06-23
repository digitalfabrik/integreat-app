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
  featureFlags,
  iosBuildOptions: {
    BUILD_CONFIG_APP_NAME: 'Malte',
    BUILD_CONFIG_BUNDLE_IDENTIFIER: 'de.malte-app'
  }
}

module.exports = MalteBuildConfig
