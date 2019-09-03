// @flow

import { Sentry, SentryLog } from 'react-native-sentry'

export default class SentryIntegration {
  sentry: Sentry

  constructor () {
    this.sentry = Sentry.config('https://93d8df4f46614d6895d12879640c3a19@sentry.integreat-app.de/1',
      {
        deactivateStacktraceMerging: true,
        logLevel: SentryLog.None,
        disableNativeIntegration: false,
        handlePromiseRejection: true
      }
    )
  }

  async install () {
    if (__DEV__) {
      // Native crashes do not get reported when the app is not a release build. Therefore we can disable sentry when
      // we recognize a dev build. This also adds consistency with the reporting of JS crashes.
      // This way we only report JS crashes exactly when native crashes get reported.
      return
    }

    await this.sentry.install()

    Sentry.setTagsContext({
      environment: __DEV__ ? 'dev' : 'release'
    })
  }
}
