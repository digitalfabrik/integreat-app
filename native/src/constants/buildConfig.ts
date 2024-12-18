// @ts-expect-error This module does not really exist but is instead proxied by the metro.config.js
// to the directory in the corresponding build config to allow passing the selected build config to the runtime code.
// More information can be found in native/docs/build-configs.md#technical-information
import name from 'build-config-name'
import { SvgProps } from 'react-native-svg'

import loadBuildConfig, { COMMON } from 'build-configs'
import { INTEGREAT_ASSETS, MALTE_ASSETS, ASCHAFFENBURG_ASSETS } from 'build-configs/AssetsType'
import { CommonBuildConfigType } from 'build-configs/BuildConfigType'
import aschaffenburgLoadingImage from 'build-configs/aschaffenburg/assets/app-icon-inverted.svg'
import aschaffenburgAppIcon from 'build-configs/aschaffenburg/assets/app-icon-round.svg'
import integreatLoadingImage from 'build-configs/integreat/assets/app-icon-inverted.svg'
import integreatAppIcon from 'build-configs/integreat/assets/app-icon-round.svg'
import integreatCityNotCooperatingIcon from 'build-configs/integreat/assets/city-not-cooperating.svg'
import malteLoadingImage from 'build-configs/malte/assets/app-icon-circle.svg'
import malteAppIcon from 'build-configs/malte/assets/app-icon-round.svg'

type AssetsType = {
  AppIcon: React.JSXElementConstructor<SvgProps>
  LoadingImage: React.JSXElementConstructor<SvgProps>
  CityNotCooperatingIcon?: React.JSXElementConstructor<SvgProps>
}

const buildConfig = (): CommonBuildConfigType => loadBuildConfig(name, COMMON)

export const buildConfigAssets = (): AssetsType => {
  const assetsName = buildConfig().assets

  if (assetsName === INTEGREAT_ASSETS) {
    return {
      AppIcon: integreatAppIcon,
      LoadingImage: integreatLoadingImage,
      CityNotCooperatingIcon: integreatCityNotCooperatingIcon,
    }
  }
  if (assetsName === MALTE_ASSETS) {
    return {
      AppIcon: malteAppIcon,
      LoadingImage: malteLoadingImage,
    }
  }
  if (assetsName === ASCHAFFENBURG_ASSETS) {
    return {
      AppIcon: aschaffenburgAppIcon,
      LoadingImage: aschaffenburgLoadingImage,
    }
  }

  throw new Error(`Unknown icon set ${assetsName}. Check your build config!`)
}

export default buildConfig
