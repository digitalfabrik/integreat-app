// @flow

import { lightTheme, darkTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'

const MalteBuildConfig: BuildConfigType = {
  appName: 'Malte',
  lightTheme,
  darkTheme,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  },
  android: {
    applicationId: 'tuerantuer.app.integreat',
    googleServices: null
  },
  ios: {
    bundleIdentifier: 'de.integreat-app',
    googleServices: null
  }
}

module.exports = MalteBuildConfig
