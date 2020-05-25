// @flow

import malteTheme from '../themes/malte'
import type { AppConfigType } from '../AppConfigType'

const MalteAppConfig: AppConfigType = {
  appTitle: 'Malteser',
  theme: malteTheme,
  // TODO Add itunesAppId
  cmsUrl: 'https://malteser.tuerantuer.org',
  locationIcon: '/location-big.svg',
  logoWide: '/malteser-logo.png',
  internalLinksHijackPattern: 'https?:\\/\\/malteser\\.tuerantuer\\.org(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*'
}

module.exports = MalteAppConfig
