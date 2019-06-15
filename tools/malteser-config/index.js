// @flow

import type { AppConfigType } from '../../src/AppConfigType'
import type { ThemeType } from '../../src/modules/theme/constants/theme'
import dimensions from '../../src/modules/theme/constants/dimensions'
import fonts from '../../src/modules/theme/constants/fonts'
import helpers from '../../src/modules/theme/constants/helpers'

const theme: ThemeType = {
  colors: {
    themeColor: '#e2001a',
    themeDarkColor: '#830012',
    backgroundAccentColor: '#fafafa',
    textColor: '#000000',
    textSecondaryColor: '#585858',
    textDecorationColor: '#c7c7c7',
    textDisabledColor: '#d0d0d0',
    backgroundColor: '#ffffff'
  },
  dimensions: dimensions,
  fonts: fonts,
  helpers: helpers
}

const IntegreatAppConfig: AppConfigType = {
  appTitle: 'Malteser',
  theme: theme,
  cmsUrl: 'https://malteser.tuerantuer.org',
  locationIcon: '/location-big.svg',
  logoWide: '/malteser-logo.png'
}

module.exports = IntegreatAppConfig
