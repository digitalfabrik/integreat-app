// @flow

import type { BuildConfigType } from '../../../../build-configs/configs/BuildConfigType'
import loadBuildConfig from '../../../../build-configs'
import { INTEGREAT_ICONS } from '../../../../build-configs/configs/integreat'
import { MALTE_ICONS } from '../../../../build-configs/configs/malte'
import integreatAppLogo from '../../../../build-configs/configs/integreat/assets/app-logo.png'
import integreatLocationMarker from '../../../../build-configs/configs/integreat/assets/location-marker.svg'
import malteAppLogo from '../../../../build-configs/configs/malte/assets/app-logo.svg'
import malteLocationMarker from '../../../../build-configs/configs/malte/assets/location-marker.svg'
import integreatIntroLanguageIcon from '../../../../build-configs/iconsSets/integreat/Language.svg'
import integreatIntroEventsIcon from '../../../../build-configs/iconsSets/integreat/Events.svg'
import integreatIntroOffersIcon from '../../../../build-configs/iconsSets/integreat/Offers.svg'
import integreatIntroSearchIcon from '../../../../build-configs/iconsSets/integreat/Search.svg'
import malteIntroLanguageIcon from '../../../../build-configs/iconsSets/malte/Language.svg'
import malteIntroEventsIcon from '../../../../build-configs/iconsSets/malte/Events.svg'
import malteIntroOffersIcon from '../../../../build-configs/iconsSets/malte/Offers.svg'
import malteIntroSearchIcon from '../../../../build-configs/iconsSets/malte/Search.svg'

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
  const iconSetString = buildConfig().iconSet
  if (iconSetString === INTEGREAT_ICONS) {
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
  } else if (iconSetString === MALTE_ICONS) {
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
