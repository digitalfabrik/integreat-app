// @flow

import type { AppConfigType } from '../../src/AppConfigType'

import brightTheme from '../../src/modules/theme/constants/theme'

const IntegreatAppConfig: AppConfigType = {
  appTitle: 'Integreat',
  itunesAppId: '1072353915',
  theme: brightTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  locationIcon: '/location-big.svg',
  logoWide: '/integreat-app-logo.png',
  internalLinksHijackPattern: 'https?:\\/\\/(cms\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*'
}

module.exports = IntegreatAppConfig
