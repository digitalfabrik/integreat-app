// @flow

import type { BuildConfigType } from '../../../../build-configs/configs/BuildConfigType'
import loadBuildConfig from '../../../../build-configs'
import { INTEGREAT_ICONS } from '../../../../build-configs/configs/integreat'
import { MALTE_ICONS } from '../../../../build-configs/configs/malte'
import integreatAppLogo from '../../../../build-configs/configs/integreat/assets/app-logo.png'
import integreatLocationMarker from '../../../../build-configs/configs/integreat/assets/location-marker.svg'
import malteAppLogo from '../../../../build-configs/configs/malte/assets/app-logo.svg'
import malteLocationMarker from '../../../../build-configs/configs/malte/assets/location-marker.svg'

const buildConfigIcons = (iconSet: string) => {
  if (iconSet === INTEGREAT_ICONS) {
    return {
      appLogo: integreatAppLogo,
      locationMarker: integreatLocationMarker
    }
  } else if (iconSet === MALTE_ICONS) {
    return {
      appLogo: malteAppLogo,
      locationMarker: malteLocationMarker
    }
  }
  throw new Error(`Unknown icon set ${iconSet}. Check your build config!`)
}

const buildConfig = (): {| ...BuildConfigType, appLogo: string, locationMarker: string |} => {
  const config = loadBuildConfig(process.env.BUILD_CONFIG_NAME)
  const icons = buildConfigIcons(config.iconSet)
  return { ...icons, ...config }
}

export default buildConfig
