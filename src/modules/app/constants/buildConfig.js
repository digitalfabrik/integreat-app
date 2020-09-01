// @flow

import type { BuildConfigType } from '../../../../build-configs/configs/BuildConfigType'
import loadBuildConfig from '../../../../build-configs'
import integreatAppLogo from '../../../../build-configs/assets/integreat/app-logo.png'
import integreatLocationMarker from '../../../../build-configs/assets/integreat/location-marker.svg'
import malteAppLogo from '../../../../build-configs/assets/malte/app-logo.svg'
import malteLocationMarker from '../../../../build-configs/assets/malte/location-marker.svg'
import integreatIntroLanguageIcon from '../../../../build-configs/assets/integreat/Language.svg'
import integreatIntroEventsIcon from '../../../../build-configs/assets/integreat/Events.svg'
import integreatIntroOffersIcon from '../../../../build-configs/assets/integreat/Offers.svg'
import integreatIntroSearchIcon from '../../../../build-configs/assets/integreat/Search.svg'
import malteIntroLanguageIcon from '../../../../build-configs/assets/malte/Language.svg'
import malteIntroEventsIcon from '../../../../build-configs/assets/malte/Events.svg'
import malteIntroOffersIcon from '../../../../build-configs/assets/malte/Offers.svg'
import malteIntroSearchIcon from '../../../../build-configs/assets/malte/Search.svg'
import { INTEGREAT_ASSETS, MALTE_ASSETS } from '../../../../build-configs/assets/AssetsType'

type IconSetType = {|
  appLogo: string,
  locationMarker: string,
  intro: {
    events: string,
    language: string,
    offers: string,
    search: string
  }
|}

export const buildConfigIconSet = (): IconSetType => {
  const iconSetString = buildConfig().assets
  if (iconSetString === INTEGREAT_ASSETS) {
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
  } else if (iconSetString === MALTE_ASSETS) {
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
  throw new Error(`Unknown icon set ${iconSetString}. Check your build config!`)
}

const buildConfig = (): BuildConfigType => loadBuildConfig(process.env.BUILD_CONFIG_NAME)

export default buildConfig
