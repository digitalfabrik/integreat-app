// @flow

import { lightTheme, darkTheme } from '../../themes/integreat'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatBuildConfig: BuildConfigType = {
  applicationId: 'tuerantuer.app.integreat',
  appName: 'Integreat',
  lightTheme,
  darkTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  }
}

module.exports = IntegreatBuildConfig
