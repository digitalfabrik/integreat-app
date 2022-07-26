/* eslint-disable no-console */
import * as Sentry from '@sentry/react-native'
import { SeverityLevel } from '@sentry/types'

import { FetchError, NotFoundError } from 'api-client'

import buildConfig from '../constants/buildConfig'

const sentryEnabled = (): boolean => buildConfig().featureFlags.sentry
const developerFriendly = (): boolean => buildConfig().featureFlags.developerFriendly

export const initSentry = (): void => {
  if (!sentryEnabled()) {
    // Native crashes do not get reported when the app is not a release build. Therefore we can disable sentry when
    // we recognize a dev build. This also adds consistency with the reporting of JS crashes.
    // This way we only report JS crashes exactly when native crashes get reported.
    return
  }

  Sentry.init({
    dsn: 'https://3dfd3051678042b2b04cb5a6c2d869a4@sentry.tuerantuer.org/2'
  })
}

export const log = (message: string, level: SeverityLevel = 'debug'): void => {
  if (sentryEnabled()) {
    Sentry.addBreadcrumb({ message, level })
  }
  if (developerFriendly()) {
    switch (level) {
      case 'fatal':
      case 'error':
        console.error(message)
        break
      case 'warning':
        console.warn(message)
        break
      case 'log':
        console.log(message)
        break
      case 'info':
        console.info(message)
        break
      case 'debug':
        console.debug(message)
        break
    }
  }
}

export const reportError = (err: unknown): void => {
  if (!(err instanceof NotFoundError) && !(err instanceof FetchError) && sentryEnabled()) {
    // Report important errors if sentry is enabled (and skip e.g. errors because of no invalid internet connection)
    Sentry.captureException(err)
  }
  if (developerFriendly()) {
    console.error(err)
  }
}
