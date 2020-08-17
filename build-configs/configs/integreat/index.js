// @flow

import { lightTheme, darkTheme } from '../../themes/integreat'
import type { BuildConfigType } from '../BuildConfigType'

export const INTEGREAT_ICONS = 'INTEGREAT'

const IntegreatBuildConfig: BuildConfigType = {
  appName: 'Integreat',
  lightTheme,
  darkTheme,
  iconSet: INTEGREAT_ICONS,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  }
}

export default IntegreatBuildConfig
