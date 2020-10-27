// @flow

import type { BuildConfigType } from '../../../../../build-configs/BuildConfigType'
export { ThemeType } from '../../../../../build-configs/ThemeType'
export { BuildConfigType, LocalesType, FeatureFlagsType } from '../../../../../build-configs/BuildConfigType'

const buildConfig = (): BuildConfigType => __BUILD_CONFIG__

export default buildConfig
