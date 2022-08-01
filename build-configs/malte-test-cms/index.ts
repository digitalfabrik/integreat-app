import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType,
} from '../BuildConfigType'
import maltePlatformBuildConfigs from '../malte'

const commonMalteTestCmsBuildConfig: CommonBuildConfigType = {
  ...maltePlatformBuildConfigs.common,
  appName: 'MalteTestCms',
  cmsUrl: 'https://malte-test.tuerantuer.org',
  switchCmsUrl: 'https://cms.malteapp.de',
  featureFlags: {
    floss: false,
    pois: true,
    newsStream: true,
    pushNotifications: true,
    introSlides: true,
    jpalTracking: false,
    sentry: false,
    developerFriendly: true,
    fixedCity: null,
    cityNotCooperatingTemplate: null,
  },
}

const androidMalteTestCmsBuildConfig: AndroidBuildConfigType = {
  ...maltePlatformBuildConfigs.android,
  ...commonMalteTestCmsBuildConfig,
  applicationId: 'de.malteapp.test',
}

const iosMalteTestCmsBuildConfig: iOSBuildConfigType = {
  ...maltePlatformBuildConfigs.ios,
  ...commonMalteTestCmsBuildConfig,
}

const webMalteTestCmsBuildConfig: WebBuildConfigType = {
  ...maltePlatformBuildConfigs.web,
  ...commonMalteTestCmsBuildConfig,
}

const platformBuildConfigs = {
  common: commonMalteTestCmsBuildConfig,
  web: webMalteTestCmsBuildConfig,
  android: androidMalteTestCmsBuildConfig,
  ios: iosMalteTestCmsBuildConfig,
}

export default platformBuildConfigs
