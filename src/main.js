import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'

import createBrowserHistory from 'history/createBrowserHistory'
import store from './store'

import LandingPage from './landing'
import LocationPage from './location'
import Hierarchy from './location/hierarchy'
import ErrorPage from './error'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

const container = document.getElementById('container')

/**
 * Holds the current history implementation
 */
export const history = createBrowserHistory()

ReactDOM.render(
  <I18nextProvider i18n={ i18n }>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          {/* The root page */}
          <Route path="/" exact component={LandingPage}/>
          {/* The location page */}
          <Route path="/location/:location/:path*" render={props => {
            let path = props.match.params.path
            return <LocationPage {...props} hierarchy={new Hierarchy(path)}/>
          }}/>
          {/* The error page */}
          <Route component={ErrorPage}/>
        </Switch>
      </Router>
    </Provider>
  </I18nextProvider>,
  container)

// Sets the splash to hidden when the page is rendered
document.getElementById('splash').className += ' splash-hidden'

// Enables hot-module-reloading if it's enabled
if (module.hot) {
  module.hot.accept()
}
