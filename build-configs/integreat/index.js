// @flow

import integreatTheme, { darkTheme as darkIntegreatTheme } from './theme'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatBuildConfig: () => BuildConfigType = () => ({
  appName: 'Integreat',
  itunesAppId: '1072353915',
  theme: integreatTheme,
  darkTheme: darkIntegreatTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  manifestUrl: '/manifest.json',
  featureFlags: {
    pois: false,
    newsStream: true
  },
  icons: {
    locationIcon: '/location-big.svg',
    headerLogo: '/integreat-app-logo.png'
  },
  splashScreen: {
    backgroundColor: integreatTheme.colors.themeColor,
    imageUrl: '/progressive-logo.jpg'
  },
  internalLinksHijackPattern: 'https?:\\/\\/(cms\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*'
})

module.exports = IntegreatBuildConfig
