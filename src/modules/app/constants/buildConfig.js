// @flow

import type { BuildConfigType } from '../../../../build-configs/configs/BuildConfigType'
import loadBuildConfig from '../../../../build-configs'

const buildConfig = (): BuildConfigType => loadBuildConfig(process.env.BUILD_CONFIG_NAME)

export default buildConfig
