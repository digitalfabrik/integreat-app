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
      google_app_id: '1:146599424234:android:b110d70b79ff7ce351a793',
      gcm_defaultSenderId: '146599424234',
      default_web_client_id: '146599424234-ekfbl5uo9bfi7u1p6lu417tbdolorhnl.apps.googleusercontent.com',
      ga_trackingId: null,
      firebase_database_url: 'https://malte-2020.firebaseio.com',
      google_api_key: 'AIzaSyDZNWm7Cvh3O4DjfTupTGErQVtvz1o77q8',
      google_crash_reporting_api_key: 'AIzaSyDZNWm7Cvh3O4DjfTupTGErQVtvz1o77q8',
      project_id: 'malte-2020'
    }
  },
  ios: {
    bundleIdentifier: 'de.integreat-app',
    googleServices: {
      REVERSED_CLIENT_ID: 'com.googleusercontent.apps.146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k',
      API_KEY: 'AIzaSyAWOaqdFwZ7-tbwiQ79dwMyzpmR_g1cBbI',
      IS_SIGNIN_ENABLED: true,
      IS_GCM_ENABLED: true,
      GOOGLE_APP_ID: '1:146599424234:ios:56dde1442250260651a793',
      GCM_SENDER_ID: '146599424234',
      BUNDLE_ID: 'de.malteapp',
      IS_APPINVITE_ENABLED: true,
      DATABASE_URL: 'https://malte-2020.firebaseio.com',
      IS_ANALYTICS_ENABLED: false,
      PROJECT_ID: 'malte-2020',
      PLIST_VERSION: '1',
      STORAGE_BUCKET: 'malte-2020.appspot.com',
      IS_ADS_ENABLED: false,
      CLIENT_ID: '146599424234-b6rfm4skhbsv4qvob3ieh34s2chjm54k.apps.googleusercontent.com'
    }
  }
}

module.exports = MalteBuildConfig
