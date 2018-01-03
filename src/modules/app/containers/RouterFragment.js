import { Fragment } from 'redux-little-router'
import React from 'react'

import Layout from 'modules/layout/components/Layout'
import GeneralHeader from '../components/GeneralHeader'
import GeneralFooter from '../components/GeneralFooter'
import LocationLayout from './LocationLayout'

import SearchPage from 'routes/search/containers/SearchPage'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import EventsPage from 'routes/events/containers/EventsPage'
import PdfFetcherPage from 'routes/pdf-fetcher/containers/PdfFetcherPage'
import MainDisclaimerPage from 'routes/main-disclaimer/containers/MainDisclaimerPage'
import LandingPage from 'routes/landing/containers/LandingPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'

class RouterFragment extends React.Component {
  render () {
    /*
     * For routes inside a <React.Fragment /> the priority decreases with each element
     * So /disclaimer has higher priority than /:language -> '/disclaimer' resolves to /disclaimer
     */
    return <Fragment forRoute='/'>
      {/* Routes */}
      <React.Fragment>

        {/* Matches two or more arguments like /augsburg/de */}
        <Fragment forRoute='/:location/:language'>
          <React.Fragment>
            {/* Matches /augsburg/de/search -> Search */}
            <Fragment forRoute='/search'>
              <LocationLayout><SearchPage /></LocationLayout>
            </Fragment>
            {/* Matches /augsburg/de/disclaimer -> Disclaimer */}
            <Fragment forRoute='/disclaimer'>
              <LocationLayout><DisclaimerPage /></LocationLayout>
            </Fragment>
            {/* Matches /augsburg/de/events* -> Events */}
            <Fragment forRoute='/events(/:id)'>
              <LocationLayout><EventsPage /></LocationLayout>
            </Fragment>
            {/* Matches /augsburg/de/fetch-pdf/* -> Redirect */}
            <Fragment forRoute='/fetch-pdf'>
              <Layout><PdfFetcherPage /></Layout>
            </Fragment>
            {/* Matches /augsburg/de/* -> Content */}
            <Fragment forNoMatch>
              <LocationLayout><CategoriesPage /></LocationLayout>
            </Fragment>
          </React.Fragment>
        </Fragment>

        {/* Matches /disclaimer */}
        <Fragment forRoute='/disclaimer'>
          <Layout header={<GeneralHeader />}><MainDisclaimerPage /></Layout>
        </Fragment>

        {/* Matches one argument like /de */}
        <Fragment forRoute='/:language'>
          <Layout footer={<GeneralFooter />}><LandingPage /></Layout>
        </Fragment>

        {/* Matches zero arguments like / */}
        <Fragment forRoute='/'>
          <Layout footer={<GeneralFooter />}><LandingPage /></Layout>
        </Fragment>

        {/* There are no missing routes. Covered:
              * Two or more arguments (Search/Disclaimer/Events/PdfFetcher/CategoriesPage)
              * One argument (MainDisclaimer or LandingPage with language preselection)
              * No arguments (LandingPage)
              */}

      </React.Fragment>
    </Fragment>
  }
}

export default RouterFragment
