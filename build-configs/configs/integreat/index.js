// @flow

import integreatTheme, { darkTheme as darkIntegreatTheme } from '../../themes/integreat'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'

const IntegreatBuildConfig: BuildConfigType = {
  appTitle: 'Integreat',
  itunesAppId: '1072353915',
  theme: integreatTheme,
  darkTheme: darkIntegreatTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  featureFlags,
  locationIcon: '/location-big.svg',
  logoWide: '/integreat-app-logo.png',
  internalLinksHijackPattern: 'https?:\\/\\/(cms\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*'
}

module.exports = IntegreatBuildConfig
