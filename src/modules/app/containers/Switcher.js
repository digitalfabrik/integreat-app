// @flow

import React from 'react'
import { connect } from 'react-redux'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import Spinner from 'react-spinkit'
import CityModel from '../../endpoint/models/CityModel'
import Layout from '../../layout/components/Layout'
import LocationLayout from '../../layout/containers/LocationLayout'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import GeneralFooter from '../../layout/components/GeneralFooter'
import GeneralHeader from '../../layout/components/GeneralHeader'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import EventsPage from '../../../routes/events/containers/EventsPage'
import EventModel from '../../endpoint/models/EventModel'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import ExtraModel from '../../endpoint/models/ExtraModel'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import DisclaimerModel from '../../endpoint/models/DisclaimerModel'
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

import NotFoundPage from '../../../routes/notFound/NotFoundPage'
import { NOT_FOUND } from 'redux-first-router'

type Props = {
  viewportSmall: boolean,
  currentRoute: string,
  cities: Array<CityModel>,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  extras: Array<ExtraModel>,
  disclaimer: DisclaimerModel
}

/**
 * Renders different Pages depending on the current route. If the needed data is not available, a LoadingSpinner is rendered
 */
class Switcher extends React.Component<Props> {
  getComponent () {
    const {currentRoute, cities, events, categories, extras, disclaimer} = this.props
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    switch (currentRoute) {
      case NOT_FOUND:
        if (cities) {
          return <NotFoundPage />
        }
        break
      case LANDING_ROUTE:
        if (cities) {
          return <LandingPage />
        }
        break
      case MAIN_DISCLAIMER_ROUTE:
        return <MainDisclaimerPage />
      case CATEGORIES_ROUTE:
        if (categories) {
          return <CategoriesPage />
        }
        break
      case EVENTS_ROUTE:
        if (events) {
          return <EventsPage />
        }
        break
      case EXTRAS_ROUTE:
        if (extras) {
          return <ExtrasPage />
        }
        break
      case DISCLAIMER_ROUTE:
        if (disclaimer) {
          return <DisclaimerPage />
        }
        break
      case SEARCH_ROUTE:
        if (categories) {
          return <SearchPage />
        }
        break
      case PDF_FETCHER_ROUTE:
        if (categories) {
          return <PdfFetcherPage />
        }
        break
    }
    return <LoadingSpinner />
  }

  render () {
    const {viewportSmall, currentRoute} = this.props

    if (currentRoute === LANDING_ROUTE) {
      return <Layout footer={<GeneralFooter />}>
        {this.getComponent()}
      </Layout>
    } else if ([CATEGORIES_ROUTE, EVENTS_ROUTE, DISCLAIMER_ROUTE, EXTRAS_ROUTE, SEARCH_ROUTE].includes(currentRoute)) {
      return <LocationLayout>
        {this.getComponent()}
      </LocationLayout>
    }
    return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                   footer={<GeneralFooter />}>
      {this.getComponent()}
    </Layout>
  }
}

const mapStateToProps = state => ({
  viewportSmall: state.viewport.is.small,
  currentRoute: state.location.type,
  cities: state.cities,
  languages: state.languages,
  categories: state.categories,
  events: state.events,
  extras: state.extras,
  disclaimer: state.disclaimer
})

export default connect(mapStateToProps)(Switcher)
