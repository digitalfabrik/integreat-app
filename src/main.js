import 'polyfills'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'
import { Fragment, initializeCurrentLocation } from 'redux-little-router'
// Pages
import LandingPage from './routes/LandingPage'
import LocationPage from './routes/LocationPage'
import SearchPage from './routes/SearchPage'
import ErrorPage from './routes/ErrorPage'
import DisclaimerPage from './routes/DisclaimerPage'
import EventsPage from './routes/EventsPage'
import PdfFetcherPage from './routes/PdfFetcherPage'
import MainDisclaimerPage from './routes/MainDisclaimerPage/index'
import PageRedirector from './routes/PageRedirectorPage'
// Local imports
import store from './store'
import RichLayout from './components/RichLayout/index'
import Layout from './components/Layout/index'

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
          <Fragment forRoute="/disclaimer">
            <RichLayout><MainDisclaimerPage/></RichLayout>
          </Fragment>
          {/* Matches / */}
          <Fragment forRoute="/">
            <Layout><LandingPage/></Layout>
          </Fragment>

          {/* Matches /augsburg/de */}
          <Fragment forRoute="/:location/:language">
            <div>
              {/* Matches /augsburg/de/search -> Search */}
              <Fragment forRoute="/search">
                <RichLayout><SearchPage/></RichLayout>
              </Fragment>
              {/* Matches /augsburg/de/disclaimer -> Disclaimer */}
              <Fragment forRoute="/disclaimer">
                <RichLayout><DisclaimerPage/></RichLayout>
              </Fragment>
              {/* Matches /augsburg/de/events -> Events */}
              <Fragment forRoute="/events">
                <RichLayout><EventsPage/></RichLayout>
              </Fragment>
              {/* Matches /augsburg/de/redirect -> Redirect */}
              <Fragment forRoute="/redirect">
                <RichLayout><PageRedirector/></RichLayout>
              </Fragment>
              {/* Matches /augsburg/de/fetch-pdf/* -> Redirect */}
              <Fragment forRoute="/fetch-pdf/*">
                <Layout><PdfFetcherPage/></Layout>
              </Fragment>
              {/* Matches /augsburg/de/* -> Location */}
              <Fragment forRoute="*">
                <RichLayout><LocationPage/></RichLayout>
              </Fragment>
            </div>
          </Fragment>

          {/* Matches /de */}
          <Fragment forRoute="/:language">
            <Layout><LandingPage/></Layout>
          </Fragment>

          <Fragment forNoRoute>
            <RichLayout><ErrorPage/></RichLayout>
          </Fragment>
        </div>
      </Fragment>
    </Provider>
  </I18nextProvider>
)

const container = document.getElementById('container')

ReactDOM.render(App, container)

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
