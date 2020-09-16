// @flow

import IntegreatBuildConfig from '../integreat'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatTestCmsBuildConfig: BuildConfigType = {
  ...IntegreatBuildConfig,
  appName: 'IntegreatTestCms',
  cmsUrl: 'https://cms-test.integreat-app.de',
  switchCmsUrl: 'https://cms.integreat-app.de',
  development: true,
  featureFlags: {
    pois: true,
    newsStream: true,
    pushNotifications: false,
    introSlides: true,
    sentry: false
  },
  android: {
    ...IntegreatBuildConfig.android,
    applicationId: 'tuerantuer.app.integreat',
    googleServices: null
  },
  ios: {
    ...IntegreatBuildConfig.ios,
    bundleIdentifier: 'de.integreat-app',
    provisioningProfileSpecifier: 'match Development de.integreat-app',
    googleServices: null
  }
}

export default IntegreatTestCmsBuildConfig
