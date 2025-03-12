/* eslint-disable no-console */
import type Sentry from '@sentry/react'
import { SeverityLevel } from '@sentry/types'

import { FetchError, NotFoundError } from 'shared/api'

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

export const log = async (message: string, level: SeverityLevel = 'debug'): Promise<void> => {
  try {
    const Sentry = await loadSentry()
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
  } catch (e) {
    logSentryException(e)
  }
}

// https://github.com/leaonline/easy-speech/blob/master/API.md#easyspeechinitmaxtimeout-interval-quiet-maxlengthexceeded--promiseboolean
const noTtsVoicesInstalled = 'EasySpeech: browser has no voices'
const expectedErrors = [noTtsVoicesInstalled]

export const reportError = async (error: unknown): Promise<void> => {
  const isNotFoundError = error instanceof NotFoundError
  const isNoInternetError = error instanceof FetchError
  const isExpectedError = error instanceof Error && expectedErrors.some(message => error.message.includes(message))
  const ignoreError = isNotFoundError || isNoInternetError || isExpectedError

  if (ignoreError) {
    return
  }

  if (sentryEnabled()) {
    try {
      const Sentry = await loadSentry()
      Sentry.captureException(error)
    } catch (e) {
      logSentryException(e)
    }
  }
  if (developerFriendly()) {
    console.error(error)
  }
}
