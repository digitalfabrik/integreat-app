import * as React from 'react'
import { AppRegistry, YellowBox } from 'react-native'
import App from './src/modules/app/components/App'
import 'moment/locale/de' // fixme
import SentryIntegration from './src/modules/app/SentryIntegration'

// @see: https://github.com/facebook/metro/issues/287
YellowBox.ignoreWarnings(['Require cycle:'])

const sentry = new SentryIntegration()
const sentryPromise = sentry.install()

AppRegistry.registerComponent('Integreat', () =>
  () => <App sentryPromise={sentryPromise} />
)
