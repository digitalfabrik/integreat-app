// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import Spinner from 'react-spinkit'
import Layout from '../../layout/components/Layout'
import LocationLayout, { LocationLayoutRoutes } from '../../layout/containers/LocationLayout'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import GeneralFooter from '../../layout/components/GeneralFooter'
import GeneralHeader from '../../layout/components/GeneralHeader'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import EventsPage from '../../../routes/events/containers/EventsPage'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import SearchPage from '../../../routes/search/containers/SearchPage'
import { LANDING_ROUTE } from '../routes/landing'
import { MAIN_DISCLAIMER_ROUTE } from '../routes/mainDisclaimer'
import { CATEGORIES_ROUTE } from '../routes/categories'
import { EVENTS_ROUTE } from '../routes/events'
import { EXTRAS_ROUTE } from '../routes/extras'
import { DISCLAIMER_ROUTE } from '../routes/disclaimer'
import { SEARCH_ROUTE } from '../routes/search'

import Payload from '../../endpoint/Payload'
import Failure from '../../common/components/Failure'
import { I18N_REDIRECT_ROUTE } from '../routes/i18nRedirect'
import I18nRedirect from '../../../routes/i18nRedirect/containers/I18nRedirect'

type Props = {
  viewportSmall: boolean,
  currentRoute: string,
  citiesPayload: Payload,
  categoriesPayload: Payload,
  eventsPayload: Payload,
  extrasPayload: Payload,
  disclaimerPayload: Payload
}

const LoadingSpinner = () => <Spinner name='line-scale-party' />

/**
 * Renders different Pages depending on the current route. If the needed data is not available, a LoadingSpinner is rendered
 */
class Switcher extends React.Component<Props> {
  static getFailureLoadingComponents (payload: Payload): React.Node {
    if (payload.error) {
      return <Failure error={payload.error} />
    } else if (payload.isFetching || !payload.data) {
      return <LoadingSpinner />
    } else {
      return null
    }
  }

  getPage (): React.Node {
    const {currentRoute, citiesPayload, eventsPayload, categoriesPayload, extrasPayload, disclaimerPayload} = this.props

    switch (currentRoute) {
      case I18N_REDIRECT_ROUTE:
        return Switcher.getFailureLoadingComponents(citiesPayload) || <I18nRedirect />
      case LANDING_ROUTE:
        return Switcher.getFailureLoadingComponents(citiesPayload) || <LandingPage />
      case MAIN_DISCLAIMER_ROUTE:
        return <MainDisclaimerPage />
      case CATEGORIES_ROUTE:
        return Switcher.getFailureLoadingComponents(categoriesPayload) || <CategoriesPage />
      case EVENTS_ROUTE:
        return Switcher.getFailureLoadingComponents(eventsPayload) || <EventsPage />
      case EXTRAS_ROUTE:
        return Switcher.getFailureLoadingComponents(extrasPayload) || <ExtrasPage />
      case DISCLAIMER_ROUTE:
        return Switcher.getFailureLoadingComponents(disclaimerPayload) || <DisclaimerPage />
      case SEARCH_ROUTE:
        return Switcher.getFailureLoadingComponents(categoriesPayload) || <SearchPage />
      default:
        return <Failure error={'Route not found'} />
    }
  }

  render () {
    const {viewportSmall, currentRoute} = this.props

    if (currentRoute === LANDING_ROUTE) {
      return <Layout footer={<GeneralFooter />}>
        {this.getPage()}
      </Layout>
    } else if (LocationLayoutRoutes.includes(currentRoute)) {
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
