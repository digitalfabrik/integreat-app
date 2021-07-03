import type { WebBuildConfigType } from 'build-configs/BuildConfigType'

const buildConfig = (): WebBuildConfigType => {
  return __BUILD_CONFIG__
}

export default buildConfig
