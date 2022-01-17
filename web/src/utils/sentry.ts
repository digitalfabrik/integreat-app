import * as Sentry from '@sentry/react'

import { FetchError, NotFoundError } from 'api-client'

import buildConfig from '../constants/buildConfig'

const sentryEnabled = (): boolean => buildConfig().featureFlags.sentry
const developerFriendly = (): boolean => buildConfig().featureFlags.developerFriendly

export const initSentry = (): void => {
  if (!sentryEnabled()) {
    return
  }

  Sentry.init({
    dsn: 'https://f07e705b25464bbd8b0dbbc0a6414b11@sentry.tuerantuer.org/2',
    release: `web-${__BUILD_CONFIG_NAME__}@${__VERSION_NAME__}`
  })
}

export const log = (message: string, level = 'debug'): void => {
  if (sentryEnabled()) {
    Sentry.addBreadcrumb({
      message,
      level: Sentry.Severity.fromString(level)
    })
  }
  if (developerFriendly()) {
    switch (level) {
      case Sentry.Severity.Fatal:
      case Sentry.Severity.Critical:
      case Sentry.Severity.Error:
        // eslint-disable-next-line no-console
        console.error(message)
        break
      case Sentry.Severity.Warning:
        // eslint-disable-next-line no-console
        console.warn(message)
        break
      case Sentry.Severity.Log:
        // eslint-disable-next-line no-console
        console.log(message)
        break
      case Sentry.Severity.Info:
        // eslint-disable-next-line no-console
        console.info(message)
        break
      case Sentry.Severity.Debug:
        // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.error(err)
  }
}
