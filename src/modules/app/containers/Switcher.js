// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
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
import { I18N_REDIRECT_ROUTE } from '../routes/i18nRedirect'
import I18nRedirectPage from '../../../routes/i18nRedirect/containers/I18nRedirectPage'
import { CATEGORIES_REDIRECT_ROUTE } from '../routes/categoriesRedirect'
import LanguageModel from '../../endpoint/models/LanguageModel'
import LanguageNotFoundError from '../errors/LanguageNotFoundError'
import FailureSwitcher from '../../common/containers/FailureSwitcher'
import { NOT_FOUND } from 'redux-first-router'
import CityNotFoundError from '../errors/CityNotFoundError'
import CityModel from '../../endpoint/models/CityModel'
import withLayout from '../../layout/withLayout'
import LoadingSpinner from '../../common/components/LoadingSpinner'

type Props = {
  currentRoute: string,
  citiesPayload: Payload,
  categoriesPayload: Payload,
  eventsPayload: Payload,
  extrasPayload: Payload,
  disclaimerPayload: Payload,
  languages: ?Array<LanguageModel>,
  language: ?string,
  city: ?string,
  param: ?string
}

/**
 * Switches what content should be rendered depending on the current route
 */
export class Switcher extends React.Component<Props> {
  /**
   * Renders a failure component if the payload contains an error or a LoadingSpinner if the data is currently being fetched
   * @param payload The payload to check for errors or fetching process
   * @return {*}
   */
  static renderFailureLoadingComponents = (payload: Payload): React.Node => {
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
  renderPage = (): React.Node => {
    const {
      currentRoute, citiesPayload, eventsPayload, categoriesPayload, extrasPayload, disclaimerPayload, param
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
        return Switcher.renderFailureLoadingComponents(categoriesPayload) ||
          Switcher.renderFailureLoadingComponents(citiesPayload) ||
          <CategoriesPage />
      case EVENTS_ROUTE:
        return Switcher.renderFailureLoadingComponents(eventsPayload) || <EventsPage />
      case EXTRAS_ROUTE:
        return Switcher.renderFailureLoadingComponents(extrasPayload) || <ExtrasPage />
      case DISCLAIMER_ROUTE:
        return Switcher.renderFailureLoadingComponents(disclaimerPayload) || <DisclaimerPage />
      case SEARCH_ROUTE:
        return Switcher.renderFailureLoadingComponents(categoriesPayload) || <SearchPage />
      case CATEGORIES_REDIRECT_ROUTE:
        return Switcher.renderFailureLoadingComponents(categoriesPayload) || <LoadingSpinner />
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
    const {city, citiesPayload, language, languages, currentRoute} = this.props

    // The current city is invalid, so we want to show an error
    if (city && Array.isArray(citiesPayload.data) &&
      !citiesPayload.data.find(_city => _city instanceof CityModel && _city.code === city)) {
      const error = new CityNotFoundError({city})
      const FailureSwitcherWithLayout = withLayout(currentRoute)(FailureSwitcher)
      return <FailureSwitcherWithLayout error={error} />
    }

    // The current language is not available in the current city, so we want to show an error
    if (language && city && languages && !languages.find(_language => _language.code === language)) {
      const error = new LanguageNotFoundError({city, language})
      const FailureSwitcherWithLayout = withLayout(currentRoute)(FailureSwitcher)
      return <FailureSwitcherWithLayout error={error} />
    }

    const PageWithLayout = withLayout(currentRoute)(this.renderPage)
    return <PageWithLayout />
  }
}

const mapStateToProps = state => ({
  currentRoute: state.location.type,
  citiesPayload: state.cities,
  categoriesPayload: state.categories,
  eventsPayload: state.events,
  extrasPayload: state.extras,
  disclaimerPayload: state.disclaimer,
  languages: state.languages.data,
  language: state.location.payload.language,
  city: state.location.payload.city,
  param: state.location.payload.param
})

export default connect(mapStateToProps)(Switcher)
