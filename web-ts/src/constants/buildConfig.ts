import type { WebBuildConfigType } from 'build-configs/BuildConfigType'

const buildConfig = (): WebBuildConfigType => __BUILD_CONFIG__

export default buildConfig
