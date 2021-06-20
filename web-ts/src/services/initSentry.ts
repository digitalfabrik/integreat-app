// @flow

import buildConfig from './constants/buildConfig'

const initSentry = async () => {
  if (!buildConfig().featureFlags.sentry) {
    console.log('Disabling sentry because it was disabled through the build config.')
    return
  }

  try {
    const Sentry = await import(
      /* webpackChunkName: "sentry" */
      '@sentry/react'
    )

    Sentry.init({
      dsn: 'https://f07e705b25464bbd8b0dbbc0a6414b11@sentry.tuerantuer.org/2',
      release: `web-${__BUILD_CONFIG_NAME__}@${__VERSION_NAME__}`
    })
  } catch (e) {
    console.error(e)
    console.error('Failed to load sentry entry point!')
  }
}

export default initSentry
