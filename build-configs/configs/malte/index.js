// @flow

import { lightTheme, darkTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'

const MalteBuildConfig: BuildConfigType = {
  applicationId: 'de.malteapp',
  appName: 'Malte',
  lightTheme,
  darkTheme,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  }
}

module.exports = MalteBuildConfig
