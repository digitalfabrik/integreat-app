import type { CommonBuildConfigType } from 'build-configs/BuildConfigType'
import loadBuildConfig, { COMMON } from 'build-configs'
import integreatAppIcon from 'build-configs/integreat/assets/app-icon-round.png'
import integreatLoadingImage from 'build-configs/integreat/assets/app-icon-inverted.svg'
import integreatLocationMarker from 'build-configs/integreat/assets/location-marker.svg'
import integreatIntroLanguageIcon from 'build-configs/integreat/assets/intro-slides/Language.svg'
import integreatIntroEventsIcon from 'build-configs/integreat/assets/intro-slides/Events.svg'
import integreatIntroOffersIcon from 'build-configs/integreat/assets/intro-slides/Offers.svg'
import integreatIntroSearchIcon from 'build-configs/integreat/assets/intro-slides/Search.svg'
import malteAppIcon from 'build-configs/malte/assets/app-icon-round.svg'
import malteLoadingImage from 'build-configs/malte/assets/app-icon-circle.png'
import malteLocationMarker from 'build-configs/malte/assets/location-marker.svg'
import malteIntroLanguageIcon from 'build-configs/malte/assets/intro-slides/Language.svg'
import malteIntroEventsIcon from 'build-configs/malte/assets/intro-slides/Events.svg'
import malteIntroOffersIcon from 'build-configs/malte/assets/intro-slides/Offers.svg'
import malteIntroSearchIcon from 'build-configs/malte/assets/intro-slides/Search.svg'
import aschaffenburgAppIcon from 'build-configs/aschaffenburg/assets/app-icon-round.png'
import aschaffenburgLoadingImage from 'build-configs/aschaffenburg/assets/app-icon-inverted.svg'
import { INTEGREAT_ASSETS, MALTE_ASSETS, ASCHAFFENBURG_ASSETS } from 'build-configs/AssetsType'
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
  } else if (assetsName === MALTE_ASSETS) {
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
  } else if (assetsName === ASCHAFFENBURG_ASSETS) {
    return {
      appIcon: aschaffenburgAppIcon,
      loadingImage: aschaffenburgLoadingImage
    }
  }

  throw new Error(`Unknown icon set ${assetsName}. Check your build config!`)
}

const buildConfig = (): CommonBuildConfigType => loadBuildConfig(process.env.BUILD_CONFIG_NAME, COMMON)

export default buildConfig
