// @flow

import type { BuildConfigType } from '../../../../build-configs/configs/BuildConfigType'
import loadBuildConfig from '../../../../build-configs'
import { INTEGREAT_ICONS } from '../../../../build-configs/configs/integreat'
import { MALTE_ICONS } from '../../../../build-configs/configs/malte'
import integreatAppLogo from '../../../../build-configs/configs/integreat/assets/app-logo.png'
import malteAppLogo from '../../../../build-configs/configs/malte/assets/app-logo.svg'

const buildConfigIcons = (iconSet: string) => {
  if (iconSet === INTEGREAT_ICONS) {
    return {
      appLogo: integreatAppLogo
    }
  } else if (iconSet === MALTE_ICONS) {
    return {
      appLogo: malteAppLogo
    }
  }
  throw new Error(`Unknown icon set ${iconSet}. Check your build config!`)
}

const buildConfig = (): {| ...BuildConfigType, appLogo: string |} => {
  const config = loadBuildConfig(process.env.BUILD_CONFIG_NAME)
  const icons = buildConfigIcons(config.iconSet)
  return { ...icons, ...config }
}

export default buildConfig
