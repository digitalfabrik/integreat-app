// @flow

import type { BuildConfigType } from './BuildConfigType'
import integreatBuildConfig from './integreat'
import integreatTestCmsBuildConfig from './integreat-test-cms'
import integreatE2eBuildConfig from './integreat-e2e'
import malteBuildConfig from './malte'

export const buildConfigs: { [string]: BuildConfigType } = {
  integreat: integreatBuildConfig,
  'integreat-test-cms': integreatTestCmsBuildConfig,
  'integreat-e2e': integreatE2eBuildConfig,
  malte: malteBuildConfig
}

const loadBuildConfig = (buildConfigName: ?string): BuildConfigType => {
  if (!buildConfigName) {
    throw Error('No BUILD_CONFIG_NAME supplied!')
  }
  const buildConfig = buildConfigs[buildConfigName]
  if (!buildConfig) {
    throw Error(`Invalid BUILD_CONFIG_NAME supplied: ${buildConfigName}`)
  }

  const { featureFlags: { pushNotifications }, android, ios } = buildConfig

  if ((android.googleServices === null) !== (ios.googleServices === null)) {
    console.warn('Google services should be configured for both or no platform!')
  } else if (pushNotifications === (android.googleServices === null)) {
    console.warn('Push notification feature flag does not match google service configuration!')
  }

  return buildConfig
}

export default loadBuildConfig
