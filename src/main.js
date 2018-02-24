import 'polyfills'

import React from 'react'
import ReactDOM from 'react-dom'

import App from 'modules/app/containers/App'

const container = document.getElementById('container')

ReactDOM.render(<App />, container)

// Sets the splash to hidden when the page is rendered
document.getElementById('splash').className += ' splash-hidden'

// Currently we do not have service workers. Unregister all previous ones:
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => { registration.unregister() })
  })
}

// Enables hot-module-reloading if it's enabled
if (module.hot) {
  module.hot.accept()
}
