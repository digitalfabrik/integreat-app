// @flow

import { lightTheme, darkTheme } from './theme'
import type { BuildConfigType } from '../BuildConfigType'
import { INTEGREAT_ASSETS } from '../AssetsType'

const IntegreatBuildConfig: BuildConfigType = {
  appName: 'Integreat',
  appIcon: 'app_icon_integreat',
  itunesAppId: '1072353915',
  manifestUrl: '/manifest.json',
  lightTheme, // named theme
  darkTheme,
  assets: INTEGREAT_ASSETS,
  development: false,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  shareBaseUrl: 'https://integreat.app',
  allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
  internalLinksHijackPattern: 'https?:\\/\\/(cms(-test)?\\.integreat-app\\.de|web\\.integreat-app\\.de|integreat\\.app)(?!\\/[^/]*\\/(wp-content|wp-admin|wp-json)\\/.*).*',
  featureFlags: {
    pois: false,
    newsStream: true,
    pushNotifications: true,
    introSlides: true,
    sentry: true
  },
  android: {
    splashScreen: true,
    applicationId: 'tuerantuer.app.integreat',
    googleServices: {
      googleAppId: '1:164298278764:android:3fc1f67f3883df306fd549',
      gcmDefaultSenderId: '164298278764',
      defaultWebClientId: '164298278764-hhup7orh5rvg0oumhbabqvp5giudaste.apps.googleusercontent.com',
      gaTrackingId: null,
      firebaseDatabaseUrl: 'https://integreat-2020.firebaseio.com',
      googleApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
      googleCrashReportingApiKey: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
      projectId: 'integreat-2020'
    }
  },
  ios: {
    bundleIdentifier: 'de.integreat-app',
    provisioningProfileSpecifier: 'match Development de.integreat-app',
    appleId: '1072353915',
    googleServices: {
      clientId: '164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni.apps.googleusercontent.com',
      reversedClientId: 'com.googleusercontent.apps.164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni',
      apiKey: 'AIzaSyBSnGYrUWfIAPcEsFya1OYvTMbjvfUyOEU',
      gcmSenderId: '164298278764',
      plistVersion: '1',
      bundleId: 'de.integreat-app',
      projectId: 'integreat-2020',
      storageBucket: 'integreat-2020.appspot.com',
      isAdsEnabled: false,
      isAnalyticsEnabled: false,
      isAppInviteEnabled: true,
      isGCMEnabled: true,
      isSigninEnabled: true,
      googleAppId: '1:164298278764:ios:2a69672da4d117116fd549',
      databaseUrl: 'https://integreat-2020.firebaseio.com'
    },
    launchScreen: 'LaunchScreenIntegreat'
  },
  icons: {
    locationIcon: '/location-big.svg',
    headerLogo: '/integreat-app-logo.png'
  },
  splashScreen: {
    backgroundColor: integreatTheme.colors.themeColor,
    imageUrl: '/progressive-logo.jpg'
  }
}

export default IntegreatBuildConfig
