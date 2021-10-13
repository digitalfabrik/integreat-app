// @ts-ignore This module does not really exist but is instead proxied by the metro.config.js
// to the directory in the corresponding build config to allow passing the selected build config to the runtime code.
// More information can be found in native/docs/build-configs.md#technical-information
import name from 'build-config-name'

import loadBuildConfig, { COMMON } from 'build-configs'
import { INTEGREAT_ASSETS, MALTE_ASSETS, ASCHAFFENBURG_ASSETS } from 'build-configs/AssetsType'
import { CommonBuildConfigType } from 'build-configs/BuildConfigType'
import aschaffenburgLoadingImage from 'build-configs/aschaffenburg/assets/app-icon-inverted.svg'
import aschaffenburgAppIcon from 'build-configs/aschaffenburg/assets/app-icon-round.png'
import integreatLoadingImage from 'build-configs/integreat/assets/app-icon-inverted.svg'
import integreatAppIcon from 'build-configs/integreat/assets/app-icon-round.png'
import integreatIntroEventsIcon from 'build-configs/integreat/assets/intro-slides/Events.svg'
import integreatIntroLanguageIcon from 'build-configs/integreat/assets/intro-slides/Language.svg'
import integreatIntroOffersIcon from 'build-configs/integreat/assets/intro-slides/Offers.svg'
import integreatIntroSearchIcon from 'build-configs/integreat/assets/intro-slides/Search.svg'
import integreatLocationMarker from 'build-configs/integreat/assets/location-marker.svg'
import malteLoadingImage from 'build-configs/malte/assets/app-icon-circle.png'
import malteAppIcon from 'build-configs/malte/assets/app-icon-round.svg'
import malteIntroEventsIcon from 'build-configs/malte/assets/intro-slides/Events.svg'
import malteIntroLanguageIcon from 'build-configs/malte/assets/intro-slides/Language.svg'
import malteIntroOffersIcon from 'build-configs/malte/assets/intro-slides/Offers.svg'
import malteIntroSearchIcon from 'build-configs/malte/assets/intro-slides/Search.svg'
import malteLocationMarker from 'build-configs/malte/assets/location-marker.svg'

type AssetsType = {
  appIcon: number
  loadingImage: number
  locationMarker?: number
  intro?: {
    events: number
    language: number
    offers: number
    search: number
  }
}

const buildConfig = (): CommonBuildConfigType => loadBuildConfig(name, COMMON)

export const buildConfigAssets = (): AssetsType => {
  const assetsName = buildConfig().assets

  if (assetsName === INTEGREAT_ASSETS) {
    return {
      appIcon: integreatAppIcon,
      loadingImage: integreatLoadingImage,
      locationMarker: integreatLocationMarker,
      intro: {
        events: integreatIntroEventsIcon,
        language: integreatIntroLanguageIcon,
        offers: integreatIntroOffersIcon,
        search: integreatIntroSearchIcon
      }
    }
  }
  if (assetsName === MALTE_ASSETS) {
    return {
      appIcon: malteAppIcon,
      loadingImage: malteLoadingImage,
      locationMarker: malteLocationMarker,
      intro: {
        events: malteIntroEventsIcon,
        language: malteIntroLanguageIcon,
        offers: malteIntroOffersIcon,
        search: malteIntroSearchIcon
      }
    }
  }
  if (assetsName === ASCHAFFENBURG_ASSETS) {
    return {
      appIcon: aschaffenburgAppIcon,
      loadingImage: aschaffenburgLoadingImage
    }
  }

  throw new Error(`Unknown icon set ${assetsName}. Check your build config!`)
}

export default buildConfig
