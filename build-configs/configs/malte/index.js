// @flow

import malteTheme, { darkTheme as darkMalteTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'
import featureFlags from '../featureFlags'
import malteOverrideLocales from '../../../locales/override-locales/malte.json'

const MalteBuildConfig: BuildConfigType = {
  appName: 'Malte',
  theme: malteTheme,
  darkTheme: darkMalteTheme,
  // TODO WEBAPP-567: Add itunesAppId
  cmsUrl: 'https://cms.malteapp.de',
  featureFlags,
  localesOverride: malteOverrideLocales,
  locationIcon: '/location-big.svg',
  logoWide: '/malteser-logo.png',
  internalLinksHijackPattern: 'https?:\\/\\/malteapp\\.de(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*'
}

module.exports = MalteBuildConfig
