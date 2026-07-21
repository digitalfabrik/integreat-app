import type {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  IosBuildConfigType,
  WebBuildConfigType,
} from '../BuildConfigType.ts'
import maltePlatformBuildConfigs from '../malte/index.ts'

const commonMalteTestCmsBuildConfig: CommonBuildConfigType = {
  ...maltePlatformBuildConfigs.common,
  appName: 'MalteTestCms',
  cmsUrl: 'https://malte-test.tuerantuer.org',
  switchCmsUrl: 'https://cms.malteapp.de',
  featureFlags: {
    introSlides: true,
    sentry: false,
    developerFriendly: true,
    fixedRegion: null,
    suggestToRegion: null,
    chat: true,
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
