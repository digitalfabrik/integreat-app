/* eslint-disable no-console */
import * as Sentry from '@sentry/react-native'
import { SeverityLevel } from '@sentry/types'

import { FetchError, NotFoundError } from 'shared/api'

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
    dsn: 'https://3dfd3051678042b2b04cb5a6c2d869a4@sentry.tuerantuer.org/2',
  })
}

export const log = (
  message: string,
  {
    level = 'debug',
    data,
  }: {
    level?: SeverityLevel
    data?: unknown
  } = { level: 'debug' },
): void => {
  if (sentryEnabled()) {
    Sentry.addBreadcrumb({ message, level }, data === undefined ? undefined : { data })
  }
  if (developerFriendly()) {
    const params = [message, data].filter(Boolean)
    switch (level) {
      case 'fatal':
      case 'error':
        console.error(...params)
        break
      case 'warning':
        console.warn(...params)
        break
      case 'log':
        console.log(...params)
        break
      case 'info':
        console.info(...params)
        break
      case 'debug':
        console.debug(...params)
        break
    }
  }
}

// https://github.com/digitalfabrik/integreat-app/issues/1759
const storeLastUpdate = 'cannot store last update for unused city'
// https://github.com/digitalfabrik/integreat-app/issues/3112
const noTtsEngineInstalled = 'No TTS engine installed'
const expectedErrors = [storeLastUpdate, noTtsEngineInstalled]

export const reportError = (error: unknown, { data }: { data?: unknown } = {}): void => {
  const isNotFoundError = error instanceof NotFoundError
  const isNoInternetError = error instanceof FetchError
  const isExpectedError = error instanceof Error && expectedErrors.some(message => error.message.includes(message))
  const ignoreError = isNotFoundError || isNoInternetError || isExpectedError

  if (ignoreError) {
    return
  }

  if (sentryEnabled()) {
    Sentry.captureException(error, data === undefined ? undefined : { data })
  }
  if (developerFriendly()) {
    console.error(...[error, data].filter(Boolean))
  }
}
