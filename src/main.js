// @flow

import './polyfills'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './modules/app/containers/App'

const container = document.getElementById('container')

if (container == null) {
  throw new Error(`Couldn't find element with id container.`)
}

ReactDOM.render(<App />, container)

// Sets the splash to hidden when the page is rendered
const splash = document.getElementById('splash')
if (splash) {
  splash.className += ' splash-hidden'
}

// Currently we do not have service workers. Unregister all previous ones:
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}

// Enables hot-module-reloading if it's enabled
// $FlowFixMe
if (module.hot) {
  module.hot.accept()
}
