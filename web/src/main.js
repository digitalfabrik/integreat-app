// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import App from './modules/app/containers/App'
import { hot } from 'react-hot-loader'
import buildConfig from './modules/app/constants/buildConfig'

const container = document.getElementById('container')

if (container == null) {
  throw new Error('Couldn\'t find element with id container.')
}

const HMRApp = hot(module)(App)

ReactDOM.render(<HMRApp />, container)

if (buildConfig().web.splashScreen) {
// Sets the splash to hidden when the page is rendered
  const splash = document.getElementById('splash')
  if (splash) {
    splash.className += ' splash-hidden'
  }
}

// Currently we do not have service workers. Unregister all previous ones:
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}
