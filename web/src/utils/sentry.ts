/* eslint-disable no-console */
import type Sentry from '@sentry/react'

import { FetchError, NotFoundError } from 'api-client'

import buildConfig from '../constants/buildConfig'

const sentryEnabled = (): boolean => buildConfig().featureFlags.sentry
const developerFriendly = (): boolean => buildConfig().featureFlags.developerFriendly

// webpackChunkName: "sentry"
const loadSentry = (): Promise<typeof Sentry> => import('@sentry/react')

const logSentryException = (e: unknown) => {
  console.error(e)
  console.error('Failed to load sentry entry point!')
}

export const initSentry = async (): Promise<void> => {
  if (!sentryEnabled()) {
    return
  }

  try {
    const Sentry = await loadSentry()
    Sentry.init({
      dsn: 'https://f07e705b25464bbd8b0dbbc0a6414b11@sentry.tuerantuer.org/2',
      release: `web-${__BUILD_CONFIG_NAME__}@${__VERSION_NAME__}`,
    })
  } catch (e) {
    logSentryException(e)
  }
}

export const log = async (message: string, level = 'debug'): Promise<void> => {
  try {
    const Sentry = await loadSentry()
    if (sentryEnabled()) {
      Sentry.addBreadcrumb({
        message,
        level: Sentry.Severity.fromString(level),
      })
    }
    if (developerFriendly()) {
      switch (level) {
        case Sentry.Severity.Fatal:
        case Sentry.Severity.Critical:
        case Sentry.Severity.Error:
          console.error(message)
          break
        case Sentry.Severity.Warning:
          console.warn(message)
          break
        case Sentry.Severity.Log:
          console.log(message)
          break
        case Sentry.Severity.Info:
          console.info(message)
          break
        case Sentry.Severity.Debug:
          console.debug(message)
          break
      }
    }
  } catch (e) {
    logSentryException(e)
  }
}

export const reportError = async (err: unknown): Promise<void> => {
  if (!(err instanceof NotFoundError) && !(err instanceof FetchError) && sentryEnabled()) {
    // Report important errors if sentry is enabled (and skip e.g. errors because of no invalid internet connection)
    try {
      const Sentry = await loadSentry()
      Sentry.captureException(err)
    } catch (e) {
      logSentryException(e)
    }
  }

  if (developerFriendly()) {
    console.error(err)
  }
}
