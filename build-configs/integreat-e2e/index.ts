import {
  AndroidBuildConfigType,
  CommonBuildConfigType,
  iOSBuildConfigType,
  WebBuildConfigType
} from '../BuildConfigType'
import integreatPlatformBuildConfigs from '../integreat'

const cityNotCooperatingTemplate =
  'Sehr geehrte Damen und Herren,\n\n' +
  'Ich wohne seit einiger Zeit in [Ort] und habe neulich versucht, Ihre Kommune in der Integreat-App zu finden. Die App stellt zahlreiche wichtige Informationen über den Alltag und die Region in verschiedenen Sprachen zur Verfügung. Das erleichtert vielen Neuzugezogenen die Eingewöhnung, was ich sehr hilfreich finde.\n\n' +
  'Ich würde mich daher sehr freuen, wenn auch Sie zukünftig bei Integreat mitmachen.\n\n\n\n' +
  'Auf der Webseite der erfahren Sie mehr:\n\n' +
  'https://integreat-app.de\n\n\n\n' +
  'Herzliche Grüße'

const integreatE2e = {
  appName: 'IntegreatE2E',
  e2e: true,
  featureFlags: {
    pois: true,
    newsStream: true,
    pushNotifications: false,
    introSlides: false,
    jpalTracking: false,
    sentry: false,
    developerFriendly: false,
    fixedCity: null,
    cityNotCooperatingTemplate
  }
}
const commonIntegreatE2eBuildConfig: CommonBuildConfigType = {
  ...integreatPlatformBuildConfigs.common,
  ...integreatE2e
}
const webIntegreatE2eBuildConfig: WebBuildConfigType = { ...integreatPlatformBuildConfigs.web, ...integreatE2e }
const androidIntegreatE2eBuildCOnfig: AndroidBuildConfigType = {
  ...integreatPlatformBuildConfigs.android,
  ...integreatE2e
}
const iosIntegreatE2eBuildConfig: iOSBuildConfigType = { ...integreatPlatformBuildConfigs.ios, ...integreatE2e }
const platformBuildConfigs = {
  common: commonIntegreatE2eBuildConfig,
  web: webIntegreatE2eBuildConfig,
  android: androidIntegreatE2eBuildCOnfig,
  ios: iosIntegreatE2eBuildConfig
}
export default platformBuildConfigs
