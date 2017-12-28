import React from 'react'
import PropTypes from 'prop-types'

import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

import LandingPage from 'routes/landing/containers/LandingPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import SearchPage from 'routes/search/containers/SearchPage'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import EventsPage from 'routes/events/containers/EventsPage'
import PdfFetcherPage from 'routes/pdf-fetcher/containers/PdfFetcherPage'
import MainDisclaimerPage from 'routes/main-disclaimer/containers/MainDisclaimerPage'
import RedirectPage from 'routes/redirect/containers/RedirectPage'
import { Fragment } from 'redux-little-router'
import Layout from 'modules/app/components/Layout'
import Store from 'Store'
import I18n from 'I18n'
import Footer from './Footer'
import AutoHeader from './AutoHeader'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.instanceOf(Store),
    i18n: PropTypes.instanceOf(I18n)
  }

  render () {
    const LandingLayout = ({children}) => <Layout footer={<Footer />}>{children}</Layout>
    const RichLayout = ({children}) => <Layout footer={<Footer />} header={<AutoHeader />}>{children}</Layout>

    return <I18nextProvider i18n={this.props.i18n.i18next}>
      <Provider store={this.props.store.redux}>
        {/*
          * For routes inside a <React.Fragment /> the priority decreases with each element
          * So /disclaimer has higher priority than /:language -> '/disclaimer' resolves to /disclaimer
          */}
        <Fragment forRoute='/'>
          {/* Routes */}
          <React.Fragment>

            {/* Matches two or more arguments like /augsburg/de */}
            <Fragment forRoute='/:location/:language'>
              <React.Fragment>
                {/* Matches /augsburg/de/search -> Search */}
                <Fragment forRoute='/search'>
                  <RichLayout><SearchPage /></RichLayout>
                </Fragment>
                {/* Matches /augsburg/de/disclaimer -> Disclaimer */}
                <Fragment forRoute='/disclaimer'>
                  <RichLayout><DisclaimerPage /></RichLayout>
                </Fragment>
                {/* Matches /augsburg/de/events* -> Events */}
                <Fragment forRoute='/events*'>
                  <RichLayout><EventsPage /></RichLayout>
                </Fragment>
                {/* Matches /augsburg/de/redirect -> Redirect */}
                <Fragment forRoute='/redirect'>
                  <RichLayout><RedirectPage /></RichLayout>
                </Fragment>
                {/* Matches /augsburg/de/fetch-pdf/* -> Redirect */}
                <Fragment forRoute='/fetch-pdf/*'>
                  <Layout><PdfFetcherPage /></Layout>
                </Fragment>
                {/* Matches /augsburg/de/* -> Content */}
                <Fragment forNoMatch>
                  <RichLayout><CategoriesPage /></RichLayout>
                </Fragment>
              </React.Fragment>
            </Fragment>

            {/* Matches /disclaimer */}
            <Fragment forRoute='/disclaimer'>
              <RichLayout><MainDisclaimerPage /></RichLayout>
            </Fragment>

            {/* Matches one argument like /de */}
            <Fragment forRoute='/:language'>
              <LandingLayout><LandingPage /></LandingLayout>
            </Fragment>

            {/* Matches zero arguments like / */}
            <Fragment forRoute='/'>
              <LandingLayout><LandingPage /></LandingLayout>
            </Fragment>

            {/* There are no missing routes. Covered:
              * Two or more arguments (Search/Disclaimer/Events/PdfFetcher/CategoriesPage)
              * One argument (MainDisclaimer or LandingPage with language preselection)
              * No arguments (LandingPage)
              */}

          </React.Fragment>
        </Fragment>
      </Provider>
    </I18nextProvider>
  }
}

export default App
