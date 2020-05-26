// @flow

import malteTheme, { darkTheme as darkMalteTheme } from '../../themes/malte'
import type { AppConfigType } from '../AppConfigType'
import featureFlags from '../featureFlags'

const MalteAppConfig: AppConfigType = {
  appTitle: 'Malteser',
  theme: malteTheme,
  darkTheme: darkMalteTheme,
  // TODO WEBAPP-567: Add itunesAppId
  cmsUrl: 'https://malteser.tuerantuer.org',
  featureFlags,
  locationIcon: '/location-big.svg',
  logoWide: '/malteser-logo.png',
  internalLinksHijackPattern: 'https?:\\/\\/malteser\\.tuerantuer\\.org(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*'
}

module.exports = MalteAppConfig
