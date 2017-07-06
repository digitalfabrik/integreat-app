/**
 * Holds the current history implementation
 */
import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'

import createBrowserHistory from 'history/createBrowserHistory'
import App from './App'

const container = document.getElementById('container')

export const history = createBrowserHistory()

ReactDOM.render(<App history={history}/>, container)

// Sets the splash to hidden when the page is rendered
document.getElementById('splash').className += ' splash-hidden'

// Enables hot-module-reloading if it's enabled
if (module.hot) {
  module.hot.accept()
}
