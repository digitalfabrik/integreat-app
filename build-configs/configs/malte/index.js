// @flow

import { lightTheme, darkTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'
import malteOverrideLocales from '../../../locales/override-locales/malte.json'

export const MALTE_ICONS = 'MALTE'

const MalteBuildConfig: BuildConfigType = {
  appName: 'Malte',
  lightTheme,
  darkTheme,
  iconSet: MALTE_ICONS,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  localesOverride: malteOverrideLocales,
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  }
}

export default MalteBuildConfig
