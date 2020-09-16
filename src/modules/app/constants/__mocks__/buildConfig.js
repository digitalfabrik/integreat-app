// @flow

import type {
  BuildConfigType
} from '../../../../../build-configs/configs/BuildConfigType'
import { darkTheme, lightTheme } from '../../../../../build-configs/themes/integreat'
import { INTEGREAT_ICONS } from '../../../../../build-configs/configs/integreat'

export const buildConfigIconSet = (): {| appLogo: string, locationMarker: string |} => {
  throw new Error('Mock not yet implemented!')
}

const buildConfig = jest.fn((): BuildConfigType => ({
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
}))

export default buildConfig
