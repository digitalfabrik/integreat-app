// @flow

import * as Sentry from '@sentry/react-native'
import buildConfig from './constants/buildConfig'

const initSentry = () => {
  if (!buildConfig().featureFlags.sentry) {
    // Native crashes do not get reported when the app is not a release build. Therefore we can disable sentry when
    // we recognize a dev build. This also adds consistency with the reporting of JS crashes.
    // This way we only report JS crashes exactly when native crashes get reported.
    return
  }

  Sentry.init({
    dsn: 'https://3dfd3051678042b2b04cb5a6c2d869a4@sentry.tuerantuer.org/2'
  })
}

export default initSentry
