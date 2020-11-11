// @flow

import buildConfig from './constants/buildConfig'

const initSentry = async () => {
  if (!buildConfig().featureFlags.sentry) {
    return
  }

  try {
    const Sentry = await import(
      /* webpackChunkName: "sentry" */
      '@sentry/react'
    )

    Sentry.init({
      dsn: 'https://f07e705b25464bbd8b0dbbc0a6414b11@sentry.tuerantuer.org/2'
      // release: "my-project-name@" + process.env.npm_package_version,
    })
  } catch (e) {
    console.error('Failed to load sentry entry point!')
  }
}

export default initSentry
