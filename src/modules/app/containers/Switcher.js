// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import EventsPage from '../../../routes/events/containers/EventsPage'
import ExtrasPage from '../../../routes/extras/containers/ExtrasPage'
import WohnenExtraPage from '../../../routes/wohnen/containers/WohnenExtraPage'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
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
import { I18N_REDIRECT_ROUTE } from '../routes/i18nRedirect'
import I18nRedirectPage from '../../../routes/i18nRedirect/containers/I18nRedirectPage'
import LanguageModel from '../../endpoint/models/LanguageModel'
import LanguageNotFoundError from '../errors/LanguageNotFoundError'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import { NOT_FOUND } from 'redux-first-router'
import CityNotFoundError from '../errors/CityNotFoundError'
import CityModel from '../../endpoint/models/CityModel'
import LoadingSpinner from '../../common/components/LoadingSpinner'
import Layout from '../../layout/components/Layout'
import LocationLayout, { LocationLayoutRoutes } from '../../layout/containers/LocationLayout'
import GeneralHeader from '../../layout/components/GeneralHeader'
import GeneralFooter from '../../layout/components/GeneralFooter'
import type { StateType } from '../StateType'
import type { Node } from 'react'
import { SPRUNGBRETT_ROUTE } from '../routes/sprungbrett'
import ExtraModel from '../../endpoint/models/ExtraModel'
import { WOHNEN_ROUTE } from '../routes/wohnen'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import DisclaimerModel from '../../endpoint/models/DisclaimerModel'

type PropsType = {
  currentRoute: string,
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  eventsPayload: Payload<Array<EventModel>>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettExtraPage>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<DisclaimerModel>,
  languages: ?Array<LanguageModel>,
  language: ?string,
  city: ?string,
  param: ?string,
  viewportSmall: boolean
}

/**
 * Switches what content should be rendered depending on the current route
 */
export class Switcher extends React.Component<PropsType> {
  /**
   * Renders a failure component if the payload contains an error or a LoadingSpinner if the data is currently being fetched
   * @param payload The payload to check for errors or fetching process
   * @return {*}
   */
  static renderFailureLoadingComponents = (payload: Payload<any>): Node => {
    if (payload.error) {
      return <FailureSwitcher error={payload.error} />
    } else if (payload.isFetching || !payload.data) {
      return <LoadingSpinner />
    } else {
      return null
    }
  }

  /**
   * Renders the right page for the current route or a failure or loading component if there was an error during fetching
   * @return {*}
   */
  renderPage = (): Node => {
    const {
      currentRoute, citiesPayload, eventsPayload, categoriesPayload, extrasPayload, disclaimerPayload, sprungbrettJobsPayload, wohnenPayload, param
    } = this.props

    switch (currentRoute) {
      case I18N_REDIRECT_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) || <I18nRedirectPage />
      case LANDING_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) || <LandingPage />
      case MAIN_DISCLAIMER_ROUTE:
        return <MainDisclaimerPage />
      case CATEGORIES_ROUTE:
        // The CategoriesPage needs cities and categories
        return Switcher.renderFailureLoadingComponents(citiesPayload) ||
          Switcher.renderFailureLoadingComponents(categoriesPayload) ||
          <CategoriesPage />
      case EVENTS_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) ||
          Switcher.renderFailureLoadingComponents(eventsPayload) ||
          <EventsPage />
      case EXTRAS_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) ||
          Switcher.renderFailureLoadingComponents(extrasPayload) ||
          <ExtrasPage />
      case SPRUNGBRETT_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) ||
          Switcher.renderFailureLoadingComponents(extrasPayload) ||
          Switcher.renderFailureLoadingComponents(sprungbrettJobsPayload) ||
          <SprungbrettExtraPage />
      case WOHNEN_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) ||
          Switcher.renderFailureLoadingComponents(extrasPayload) ||
          Switcher.renderFailureLoadingComponents(wohnenPayload) ||
          <WohnenExtraPage />
      case DISCLAIMER_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) ||
          Switcher.renderFailureLoadingComponents(disclaimerPayload) ||
          <DisclaimerPage />
      case SEARCH_ROUTE:
        return Switcher.renderFailureLoadingComponents(citiesPayload) ||
          Switcher.renderFailureLoadingComponents(categoriesPayload) ||
          <SearchPage />
      case NOT_FOUND:
        // The only possibility to be in the NOT_FOUND route is if we have "/:param" as path and the param is neither
        // "disclaimer" nor a city, so we want to show an error that the param is not an available city
        if (param) {
          const error = new CityNotFoundError({city: param})
          return <FailureSwitcher error={error} />
        }
    }
    throw new Error(`For the route ${currentRoute} was no content selected in the Switcher which should be displayed.`)
  }

  render () {
    const {city, citiesPayload, language, languages, currentRoute, viewportSmall} = this.props

    // The current city is invalid, so we want to show an error
    if (city && Array.isArray(citiesPayload.data) &&
      !citiesPayload.data.find(_city => _city instanceof CityModel && _city.code === city)) {
      const error = new CityNotFoundError({city})
      return (
        <Layout header={<GeneralHeader viewportSmall={viewportSmall} />} footer={<GeneralFooter />}>
          <FailureSwitcher error={error} />
        </Layout>
      )
    }

    // The current language is not available in the current city, so we want to show an error
    if (language && city && languages && !languages.find(_language => _language.code === language)) {
      const error = new LanguageNotFoundError({city, language})
      return (
        <Layout header={<GeneralHeader viewportSmall={viewportSmall} />} footer={<GeneralFooter />}>
          <FailureSwitcher error={error} />
        </Layout>
      )
    }

    if (currentRoute === LANDING_ROUTE) {
      return (
        <Layout footer={<GeneralFooter />}>
          {this.renderPage()}
        </Layout>
      )
    } else if (LocationLayoutRoutes.includes(currentRoute)) {
      return (
        <LocationLayout>
          {this.renderPage()}
        </LocationLayout>
      )
    } else if (currentRoute === I18N_REDIRECT_ROUTE) {
      return (
        <Layout>
          {this.renderPage()}
        </Layout>
      )
    } else {
      // MAIN_DISCLAIMER_ROUTE, NOT_FOUND
      return (
        <Layout header={<GeneralHeader viewportSmall={viewportSmall} />} footer={<GeneralFooter />}>
          {this.renderPage()}
        </Layout>
      )
    }
  }
}

const mapStateToProps = (state: StateType) => ({
  currentRoute: state.location.type,
  citiesPayload: state.cities,
  categoriesPayload: state.categories,
  eventsPayload: state.events,
  extrasPayload: state.extras,
  sprungbrettJobsPayload: state.sprungbrettJobs,
  wohnenPayload: state.wohnen,
  disclaimerPayload: state.disclaimer,
  languages: state.languages.data,
  language: state.location.payload.language,
  city: state.location.payload.city,
  param: state.location.prev.payload.param,
  viewportSmall: state.viewport.is.small
})

export default connect(mapStateToProps)(Switcher)
