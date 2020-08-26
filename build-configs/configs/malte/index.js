// @flow

import { lightTheme, darkTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'

const MalteBuildConfig: BuildConfigType = {
  appName: 'Malte',
  lightTheme,
  darkTheme,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  },
  android: {
    applicationId: 'tuerantuer.app.integreat',
    googleServices: {
      googleAppId: '1:146599424234:android:b110d70b79ff7ce351a793',
      gcmDefaultSenderId: '146599424234',
      defaultWebClientId: '146599424234-ekfbl5uo9bfi7u1p6lu417tbdolorhnl.apps.googleusercontent.com',
      gaTrackingId: null,
      firebaseDatabaseUrl: 'https://malte-2020.firebaseio.com',
      googleApiKey: 'AIzaSyDZNWm7Cvh3O4DjfTupTGErQVtvz1o77q8',
      googleCrashReportingApiKey: 'AIzaSyDZNWm7Cvh3O4DjfTupTGErQVtvz1o77q8',
      projectId: 'malte-2020'
    }
  },
  ios: {
    bundleIdentifier: 'de.integreat-app',
    googleServices: {
      clientId: '146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k.apps.googleusercontent.com',
      reverseClientId: 'com.googleusercontent.apps.146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k',
      apiKey: 'AIzaSyAWOaqdFwZ7-tbwiQ79dwMyzpmR_g1cBbI',
      googleAppId: '1:146599424234:ios:56dde1442250260651a793',
      gcmSenderId: '146599424234',
      bundleId: 'de.malteapp',
      databaseUrl: 'https://malte-2020.firebaseio.com',
      projectId: 'malte-2020',
      plistVersion: '1',
      storageBucket: 'malte-2020.appspot.com',
      isAdsEnabled: false,
      isAnalyticsEnabled: false,
      isAppInviteEnabled: true,
      isGCMEnabled: true,
      isSignInEnabled: true
    }
  }
}

module.exports = MalteBuildConfig
