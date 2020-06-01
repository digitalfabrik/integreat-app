// @flow

import malteTheme, { darkTheme as darkMalteTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'

const MalteBuildConfig: BuildConfigType = {
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

module.exports = MalteBuildConfig
