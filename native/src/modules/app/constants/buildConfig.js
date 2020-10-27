// @flow

import type { BuildConfigType } from 'build-configs/BuildConfigType'
import loadBuildConfig from 'build-configs'
import integreatAppLogo from 'build-configs/integreat/assets/app-logo.png'
import integreatLocationMarker from 'build-configs/integreat/assets/location-marker.svg'
import malteAppLogo from 'build-configs/malte/assets/app-logo.svg'
import malteLocationMarker from 'build-configs/malte/assets/location-marker.svg'
import integreatIntroLanguageIcon from 'build-configs/integreat/assets/Language.svg'
import integreatIntroEventsIcon from 'build-configs/integreat/assets/Events.svg'
import integreatIntroOffersIcon from 'build-configs/integreat/assets/Offers.svg'
import integreatIntroSearchIcon from 'build-configs/integreat/assets/Search.svg'
import malteIntroLanguageIcon from 'build-configs/malte/assets/Language.svg'
import malteIntroEventsIcon from 'build-configs/malte/assets/Events.svg'
import malteIntroOffersIcon from 'build-configs/malte/assets/Offers.svg'
import malteIntroSearchIcon from 'build-configs/malte/assets/Search.svg'
import { INTEGREAT_ASSETS, MALTE_ASSETS } from 'build-configs/AssetsType'

export { BuildConfigType, FeatureFlagsType, LocalesType } from 'build-configs/BuildConfigType'
export { ThemeType } from 'build-configs/ThemeType'

type AssetsType = {|
  appLogo: number,
  locationMarker: number,
  intro: {
    events: number,
    language: number,
    offers: number,
    search: number
  }
|}

export const buildConfigAssets = (): AssetsType => {
  const assetsName = buildConfig().assets
  if (assetsName === INTEGREAT_ASSETS) {
    return {
      appLogo: integreatAppLogo,
      locationMarker: integreatLocationMarker,
      intro: {
        events: integreatIntroEventsIcon,
        language: integreatIntroLanguageIcon,
        offers: integreatIntroOffersIcon,
        search: integreatIntroSearchIcon
      }
    }
  } else if (assetsName === MALTE_ASSETS) {
    return {
      appLogo: malteAppLogo,
      locationMarker: malteLocationMarker,
      intro: {
        events: malteIntroEventsIcon,
        language: malteIntroLanguageIcon,
        offers: malteIntroOffersIcon,
        search: malteIntroSearchIcon
      }
    }
  }
  throw new Error(`Unknown icon set ${assetsName}. Check your build config!`)
}

const buildConfig = (): BuildConfigType => loadBuildConfig(process.env.BUILD_CONFIG_NAME)

export default buildConfig
