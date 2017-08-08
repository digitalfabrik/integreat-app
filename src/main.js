import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

// Pages
import LandingPage from './routes/LandingPage'
import LocationPage from './routes/LocationPage'
import SearchPage from './routes/SearchPage'
import ErrorPage from './routes/ErrorPage'
import DisclaimerPage from './routes/DisclaimerPage'

// Local imports
import store from './store'
import i18n from './i18n/i18n'

/**
 * Holds the current history implementation
 */
export const history = createBrowserHistory()

/**
 * The root component of our app
 */
let App = <I18nextProvider i18n={ i18n }>
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        {/* The root page */}
        <Route path="/" exact component={LandingPage}/>
        {/* The location page */}
        <Route path="/location/:location/search" exact component={SearchPage}/>
        <Route path="/location/:location/disclaimer" exact component={DisclaimerPage}/>
        <Route path="/location/:location/:path*" component={LocationPage}/>
        {/* The error page */}
        <Route component={ErrorPage}/>
      </Switch>
    </Router>
  </Provider>
</I18nextProvider>

const container = document.getElementById('container')

ReactDOM.render(App, container)

// Sets the splash to hidden when the page is rendered
document.getElementById('splash').className += ' splash-hidden'

// Enables hot-module-reloading if it's enabled
if (module.hot) {
  module.hot.accept()
}
