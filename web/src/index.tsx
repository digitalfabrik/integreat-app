import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import buildConfig from './constants/buildConfig'

const container = document.getElementById('container')

if (container == null) {
  throw new Error("Couldn't find element with id container.")
}

ReactDOM.render(<App />, container)

if (buildConfig().splashScreen) {
  // Sets the splash to hidden when the page is rendered
  const splash = document.getElementById('splash')
  if (splash) {
    splash.className += ' splash-hidden'
  }
}

// Currently we do not have service workers. Unregister all previous ones:
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister()
    })
  })
}
