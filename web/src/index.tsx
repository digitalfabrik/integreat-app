import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'

import App from './App'
import buildConfig from './constants/buildConfig'

const HMRApp = hot(module)(App)
const container = document.getElementById('container')

if (container == null) {
  throw new Error("Couldn't find element with id container.")
}

ReactDOM.render(<HMRApp />, container)

if (buildConfig().splashScreen) {
  // Sets the splash to hidden when the page is rendered
  const splash = document.getElementById('splash')
  if (splash) {
    splash.className += ' splash-hidden'
  }
}

// Currently we do not have service workers. Unregister all previous ones:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => {
    registration.unregister()
  })
})
