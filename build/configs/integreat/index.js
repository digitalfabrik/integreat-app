// @flow

import integreatTheme from '../themes/integreat'
import type { AppConfigType } from '../AppConfigType'

const IntegreatAppConfig: AppConfigType = {
  appTitle: 'Integreat',
  itunesAppId: '1072353915',
  theme: integreatTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  locationIcon: '/location-big.svg',
  logoWide: '/integreat-app-logo.png',
  internalLinksHijackPattern: 'https?:\\/\\/(cms\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*'
}

module.exports = IntegreatAppConfig
