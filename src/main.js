import 'polyfills'

import React from 'react'
import ReactDOM from 'react-dom'

import App from 'modules/app/containers/App'
import Store from 'Store'
import I18n from 'modules/app/I18n'

const store = new Store()
store.init()

const i18n = new I18n()
i18n.init(store)

const container = document.getElementById('container')

ReactDOM.render(<App store={store} i18n={i18n}/>, container)

// Sets the splash to hidden when the page is rendered
document.getElementById('splash').className += ' splash-hidden'

// Currently we do not have service workers to unregister all previous ones
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => { registration.unregister() })
})

// Enables hot-module-reloading if it's enabled
if (module.hot) {
  module.hot.accept()
}
