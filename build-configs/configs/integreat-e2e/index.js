// @flow

import IntegreatTestCmsBuildConfig from '../integreat-test-cms'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatE2eBuildConfig: BuildConfigType = {
  ...IntegreatTestCmsBuildConfig,
  appName: 'IntegreatE2E',
  e2e: true,
  development: false,
  featureFlags: {
    pois: true,
    newsStream: true,
    introSlides: false,
    sentry: false
  },
  android: {
    applicationId: 'tuerantuer.app.integreat',
    googleServices: null
  },
  ios: {
    bundleIdentifier: 'de.integreat-app',
    provisioningProfileSpecifier: 'match Development de.integreat-app',
    googleServices: null
  }
}

export default IntegreatE2eBuildConfig
