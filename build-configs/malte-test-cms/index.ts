import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  IosBuildConfigType,
  WebBuildConfigType,
} from '../BuildConfigType'
import maltePlatformBuildConfigs from '../malte'

const commonMalteTestCmsBuildConfig: CommonBuildConfigType = {
  ...maltePlatformBuildConfigs.common,
  appName: 'MalteTestCms',
  cmsUrl: 'https://malte-test.tuerantuer.org',
  switchCmsUrl: 'https://cms.malteapp.de',
  featureFlags: {
    introSlides: true,
    sentry: false,
    developerFriendly: true,
    fixedCity: null,
    suggestToRegion: null,
    chat: false,
  },
}

const androidMalteTestCmsBuildConfig: AndroidBuildConfigType = {
  ...maltePlatformBuildConfigs.android,
  ...commonMalteTestCmsBuildConfig,
  applicationId: 'de.malteapp.test',
}

const iosMalteTestCmsBuildConfig: IosBuildConfigType = {
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
