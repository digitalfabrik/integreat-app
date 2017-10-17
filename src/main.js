import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

// Pages
import LandingPage from './routes/LandingPage'
import LocationPage from './routes/LocationPage'
import SearchPage from './routes/SearchPage'
import ErrorPage from './routes/ErrorPage'
import DisclaimerPage from './routes/DisclaimerPage'
import EventsPage from './routes/EventsPage'

// Local imports
import store from './store'
import i18n from './i18n/i18n'
import { Fragment, initializeCurrentLocation } from 'redux-little-router'
import MainDisclaimerPage from './routes/MainDisclaimerPage/index'

/**
 * Holds the current history implementation
 */
export const history = createBrowserHistory()

const initialLocation = store.getState().router

if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation))
}

/**
 * The root component of our app
 */
let App = (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      {/*
         For routes inside a <div/> the priority decreases with each element
         So /disclaimer has higher priority than /:language -> '/disclaimer' resolves to /disclaimer
      */}
      <Fragment forRoute="/">
        {/* Routes */}
        <div>
          {/* Matches /disclaimer */}
          <Fragment forRoute="/disclaimer"><MainDisclaimerPage/></Fragment>
          {/* Matches / */}
          <Fragment forRoute="/"><LandingPage/></Fragment>

          {/* Matches /augsburg/de */}
          <Fragment forRoute="/:location/:language">
            <div>
              {/* Matches /augsburg/de/search -> Search */}
              <Fragment forRoute="/search"><SearchPage/></Fragment>
              {/* Matches /augsburg/de/disclaimer -> Disclaimer */}
              <Fragment forRoute="/disclaimer"><DisclaimerPage/></Fragment>
              {/* Matches /augsburg/de/events -> Events */}
              <Fragment forRoute="/events"><EventsPage/></Fragment>
              {/* Matches /augsburg/de/* -> Location */}
              <Fragment forRoute="*"><LocationPage/></Fragment>
            </div>
          </Fragment>

          {/* Matches /de */}
          <Fragment forRoute="/:language">
            <LandingPage/>
          </Fragment>

          <Fragment forNoRoute><ErrorPage/></Fragment>
        </div>
      </Fragment>
    </Provider>
  </I18nextProvider>
)

const container = document.getElementById('container')

ReactDOM.render(App, container)

// Sets the splash to hidden when the page is rendered
document.getElementById('splash').className += ' splash-hidden'

// Enables hot-module-reloading if it's enabled
if (module.hot) {
  module.hot.accept()
}
