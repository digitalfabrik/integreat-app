import React from 'react'
import PropTypes from 'prop-types'

import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

import LandingPage from 'routes/landing/containers'
import ContentPage from 'routes/content/containers/ContentPage'
import SearchPage from 'routes/search/containers'
import NotFoundPage from 'routes/not-found/components'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import EventsPage from 'routes/events/containers'
import PdfFetcherPage from 'routes/pdf-fetcher/containers'
import MainDisclaimerPage from 'routes/main-disclaimer/containers/TaTDisclaimerPage'
import PageRedirectorPage from 'routes/redirect/containers/PageRedirectorPage'
import { Fragment } from 'redux-little-router'
import RichLayout from 'modules/app/containers'
import Layout from 'modules/app/components'
import Store from 'Store'
import I18n from 'I18n'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.instanceOf(Store),
    i18n: PropTypes.instanceOf(I18n)
  }

  render () {
    return <I18nextProvider i18n={this.props.i18n.i18next}>
      <Provider store={this.props.store.redux}>
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
                {/* Matches /augsburg/de/events* -> Events */}
                <Fragment forRoute="/events*">
                  <RichLayout><EventsPage/></RichLayout>
                </Fragment>
                {/* Matches /augsburg/de/redirect -> Redirect */}
                <Fragment forRoute="/redirect">
                  <RichLayout><PageRedirectorPage/></RichLayout>
                </Fragment>
                {/* Matches /augsburg/de/fetch-pdf/* -> Redirect */}
                <Fragment forRoute="/fetch-pdf/*">
                  <Layout><PdfFetcherPage/></Layout>
                </Fragment>
                {/* Matches /augsburg/de/* -> Content */}
                <Fragment forRoute="*">
                  <RichLayout><ContentPage/></RichLayout>
                </Fragment>
              </div>
            </Fragment>

            {/* Matches /de */}
            <Fragment forRoute="/:language">
              <Layout><LandingPage/></Layout>
            </Fragment>

            <Fragment forNoRoute>
              <RichLayout><NotFoundPage/></RichLayout>
            </Fragment>
          </div>
        </Fragment>
      </Provider>
    </I18nextProvider>
  }
}

export default App
