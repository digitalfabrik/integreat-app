import type { WebBuildConfigType } from 'build-configs/BuildConfigType'

// Somehow this does not work without return
// eslint-disable-next-line arrow-body-style
const buildConfig = (): WebBuildConfigType => {
  return __BUILD_CONFIG__
}

export default buildConfig
