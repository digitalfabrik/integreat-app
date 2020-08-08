// @flow

import { lightTheme, darkTheme } from '../../themes/integreat'
import type { BuildConfigType } from '../BuildConfigType'

const IntegreatBuildConfig: BuildConfigType = {
  appName: 'Integreat',
  lightTheme,
  darkTheme,
  cmsUrl: 'https://cms.integreat-app.de',
  switchCmsUrl: 'https://cms-test.integreat-app.de',
  allowedHostNames: ['cms.integreat-app.de', 'cms-test.integreat-app.de'],
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  },
  android: {
    applicationId: 'tuerantuer.app.integreat',
    googleServicesConfig: {
      google_app_id: '1:164298278764:android:3fc1f67f3883df306fd549',
      gcm_defaultSenderId: '164298278764',
      default_web_client_id: '164298278764-hhup7orh5rvg0oumhbabqvp5giudaste.apps.googleusercontent.com',
      ga_trackingId: null,
      firebase_database_url: 'https://integreat-2020.firebaseio.com',
      google_api_key: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
      google_crash_reporting_api_key: 'AIzaSyBvc08_Cqww8z2Dh-EXtwHW98HXBk8T7V4',
      project_id: 'integreat-2020'
    }
  },
  ios: {
    bundleIdentifier: 'de.integreat-app',
    googleServicesConfig: {
      CLIENT_ID: '164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni.apps.googleusercontent.com',
      REVERSED_CLIENT_ID: 'com.googleusercontent.apps.164298278764-pemn49q7v283m0tqml3q8q0ltr5h8pni',
      API_KEY: 'AIzaSyBSnGYrUWfIAPcEsFya1OYvTMbjvfUyOEU',
      GCM_SENDER_ID: '164298278764',
      PLIST_VERSION: '1',
      BUNDLE_ID: 'de.integreat-app',
      PROJECT_ID: 'integreat-2020',
      STORAGE_BUCKET: 'integreat-2020.appspot.com',
      IS_ADS_ENABLED: false,
      IS_ANALYTICS_ENABLED: false,
      IS_APPINVITE_ENABLED: true,
      IS_GCM_ENABLED: true,
      IS_SIGNIN_ENABLED: true,
      GOOGLE_APP_ID: '1:164298278764:ios:2a69672da4d117116fd549',
      DATABASE_URL: 'https://integreat-2020.firebaseio.com'
    }
  }
}

module.exports = IntegreatBuildConfig
