import type Sentry from '@sentry/react'

import buildConfig from '../constants/buildConfig'

const loadSentry = async (): Promise<typeof Sentry> =>
  import(
    /* webpackChunkName: "sentry" */
    '@sentry/react'
  )

const initSentry = async (): Promise<void> => {
  if (!buildConfig().featureFlags.sentry) {
    // eslint-disable-next-line no-console
    console.log('Disabling sentry because it was disabled through the build config.')
    return
  }

  try {
    const Sentry = await loadSentry()

    Sentry.init({
      dsn: 'https://f07e705b25464bbd8b0dbbc0a6414b11@sentry.tuerantuer.org/2',
      release: `web-${__BUILD_CONFIG_NAME__}@${__VERSION_NAME__}`
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    // eslint-disable-next-line no-console
    console.error('Failed to load sentry entry point!')
  }
}

export default initSentry

export const reportError = async (err: Error): Promise<void> => {
  if (!buildConfig().featureFlags.sentry) {
    // eslint-disable-next-line no-console
    console.log('Tried to report error via sentry, but it is disabled via the build config.')
    return
  }

  try {
    const Sentry = await loadSentry()

    Sentry.captureException(err)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    // eslint-disable-next-line no-console
    console.error('Failed to load sentry entry point!')
  }
}
