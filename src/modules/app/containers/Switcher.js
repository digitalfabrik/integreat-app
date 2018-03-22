// @flow

import React from 'react'
import { connect } from 'react-redux'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import Spinner from 'react-spinkit'
import Layout from '../../layout/components/Layout'
import LocationLayout from '../../layout/containers/LocationLayout'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import GeneralFooter from '../../layout/components/GeneralFooter'
import GeneralHeader from '../../layout/components/GeneralHeader'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import EventsPage from '../../../routes/events/containers/EventsPage'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import SearchPage from '../../../routes/search/containers/SearchPage'
import PdfFetcherPage from '../../../routes/pdf-fetcher/containers/PdfFetcherPage'
import { LANDING_ROUTE } from '../routes/landing'
import { MAIN_DISCLAIMER_ROUTE } from '../routes/mainDisclaimer'
import { CATEGORIES_ROUTE } from '../routes/categories'
import { EVENTS_ROUTE } from '../routes/events'
import { EXTRAS_ROUTE } from '../routes/extras'
import { DISCLAIMER_ROUTE } from '../routes/disclaimer'
import { SEARCH_ROUTE } from '../routes/search'
import { PDF_FETCHER_ROUTE } from '../routes/pdfFetcher'

import Payload from '../../endpoint/Payload'
import Failure from '../../common/components/Failure'
import type { Node } from 'react'

type Props = {
  viewportSmall: boolean,
  currentRoute: string,
  citiesPayload: Payload,
  categoriesPayload: Payload,
  eventsPayload: Payload,
  extrasPayload: Payload,
  disclaimerPayload: Payload
}

/**
 * Renders different Pages depending on the current route. If the needed data is not available, a LoadingSpinner is rendered
 */
class Switcher extends React.Component<Props> {
  static getDisplayComponent (page: Node, payload: Payload) {
    const LoadingSpinner = () => <Spinner name='line-scale-party' />
    console.log(payload)
    if (payload.isFetching) {
      return <LoadingSpinner />
    } else if (payload.data) {
      return page
    } else {
      return <Failure error={payload.error} />
    }
  }

  getPage () {
    const {currentRoute, citiesPayload, eventsPayload, categoriesPayload, extrasPayload, disclaimerPayload} = this.props

    switch (currentRoute) {
      case LANDING_ROUTE:
        return Switcher.getDisplayComponent(<LandingPage />, citiesPayload)
      case MAIN_DISCLAIMER_ROUTE:
        return <MainDisclaimerPage />
      case CATEGORIES_ROUTE:
        return Switcher.getDisplayComponent(<CategoriesPage />, categoriesPayload)
      case EVENTS_ROUTE:
        return Switcher.getDisplayComponent(<EventsPage />, eventsPayload)
      case EXTRAS_ROUTE:
        return Switcher.getDisplayComponent(<ExtrasPage />, extrasPayload)
      case DISCLAIMER_ROUTE:
        return Switcher.getDisplayComponent(<DisclaimerPage />, disclaimerPayload)
      case SEARCH_ROUTE:
        return Switcher.getDisplayComponent(<SearchPage />, categoriesPayload)
      case PDF_FETCHER_ROUTE:
        return Switcher.getDisplayComponent(<PdfFetcherPage />, categoriesPayload)
    }
    return null
  }

  render () {
    const {viewportSmall, currentRoute} = this.props

    if (currentRoute === LANDING_ROUTE) {
      return <Layout footer={<GeneralFooter />}>
        {this.getPage()}
      </Layout>
    } else if ([CATEGORIES_ROUTE, EVENTS_ROUTE, DISCLAIMER_ROUTE, EXTRAS_ROUTE, SEARCH_ROUTE].includes(currentRoute)) {
      return <LocationLayout>
        {this.getPage()}
      </LocationLayout>
    }
    return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                   footer={<GeneralFooter />}>
      {this.getPage()}
    </Layout>
  }
}

const mapStateToProps = state => ({
  viewportSmall: state.viewport.is.small,
  currentRoute: state.location.type,
  citiesPayload: state.cities,
  languagesPayload: state.languages,
  categoriesPayload: state.categories,
  eventsPayload: state.events,
  extrasPayload: state.extras,
  disclaimerPayload: state.disclaimer
})

export default connect(mapStateToProps)(Switcher)
