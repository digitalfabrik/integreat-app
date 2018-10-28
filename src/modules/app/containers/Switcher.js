// @flow

import type { Node } from 'react'
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
import { SPRUNGBRETT_ROUTE } from '../routes/sprungbrett'
import ExtraModel from '../../endpoint/models/ExtraModel'
import { WOHNEN_ROUTE } from '../routes/wohnen'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import PageModel from '../../endpoint/models/PageModel'
import { POIS_ROUTE } from '../routes/pois'

type PropsType = {|
  currentRoute: string,
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  eventsPayload: Payload<Array<EventModel>>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettExtraPage>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>,
  languages: ?Array<LanguageModel>,
  language: ?string,
  city: ?string,
  param: ?string,
  viewportSmall: boolean,
  darkMode: boolean
|}

/**
 * Switches what content should be rendered depending on the current route
 */
export class Switcher extends React.Component<PropsType> {
  /**
   * Renders a failure component if a payload contains an error or a LoadingSpinner if the data is still being fetched
   * @param payloads The payloads to check for errors or fetching process
   * @return {*}
   */
  static renderFailureLoadingComponents = (payloads: Array<Payload<any>>): ?Node => {
    const errorPayload = payloads.find(payload => payload.error)
    if (payloads.find(payload => (payload.isFetching || !payload.data) && !payload.error)) {
      return <LoadingSpinner />
    } else if ((errorPayload && errorPayload.error) || payloads.find(payload => !payload.data)) {
      return <FailureSwitcher error={(errorPayload && errorPayload.error) || new Error('error.. :/')} />
    }
    return null
  }

  /**
   * Renders the right page for the current route or a failure/loading component if there was an error during fetching
   * @return {*}
   */
  renderPage = (): Node => {
    const {
      currentRoute, citiesPayload, eventsPayload, categoriesPayload, extrasPayload, disclaimerPayload,
      sprungbrettJobsPayload, wohnenPayload, param
    } = this.props

    switch (currentRoute) {
      case I18N_REDIRECT_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload]) ||
          <I18nRedirectPage cities={citiesPayload.data} />
      case LANDING_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload]) ||
          <LandingPage cities={citiesPayload.data} />
      case MAIN_DISCLAIMER_ROUTE:
        return <MainDisclaimerPage />
      case CATEGORIES_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload, categoriesPayload]) ||
          <CategoriesPage categories={categoriesPayload.data} cities={citiesPayload.data} />
      case EVENTS_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload, eventsPayload]) ||
          <EventsPage cities={citiesPayload.data} events={eventsPayload.data} />
      case EXTRAS_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload, extrasPayload]) ||
          <ExtrasPage cities={citiesPayload.data} extras={extrasPayload.data} />
      case SPRUNGBRETT_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload, extrasPayload, sprungbrettJobsPayload]) ||
          <SprungbrettExtraPage cities={citiesPayload.data} extras={extrasPayload.data}
                                sprungbrettJobs={sprungbrettJobsPayload.data} />
      case WOHNEN_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload, extrasPayload, wohnenPayload]) ||
          <WohnenExtraPage cities={citiesPayload.data} extras={extrasPayload.data} offers={wohnenPayload.data} />
      case DISCLAIMER_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload, disclaimerPayload]) ||
          <DisclaimerPage cities={citiesPayload.data} disclaimer={disclaimerPayload.data} />
      case SEARCH_ROUTE:
        return Switcher.renderFailureLoadingComponents([citiesPayload, categoriesPayload]) ||
          <SearchPage cities={citiesPayload.data} categories={categoriesPayload.data} />
      case POIS_ROUTE:
        const error = new Error('Nothing here yet')
        return <FailureSwitcher error={error} />
      case NOT_FOUND:
        // The only possibility to be in the NOT_FOUND route is if we have "/:param" as path and the param is neither
        // "disclaimer" nor a city, so we want to show an error that the param is not an available city
        if (param) {
          const error = new CityNotFoundError({city: param})
          return <FailureSwitcher error={error} />
        }
    }
    throw new Error(`No content was selected for the route ${currentRoute} to be displayed.`)
  }

  /**
   * Checks whether the city and language params are valid
   * @return {*}
   */
  checkRouteParams (): ?Error {
    const {city, citiesPayload, language, languages} = this.props
    if (city && citiesPayload.data && !citiesPayload.data.find(_city => _city.code === city)) {
      return new CityNotFoundError({city})
    } else if (language && city && citiesPayload.data && languages && !languages.find(lang => lang.code === language)) {
      return new LanguageNotFoundError({city, language})
    }
    return null
  }

  render () {
    const {currentRoute, viewportSmall, darkMode} = this.props

    const error = this.checkRouteParams()
    if (error) {
      return (
        <Layout header={<GeneralHeader viewportSmall={viewportSmall} />} footer={<GeneralFooter />} darkMode={darkMode}>
          <FailureSwitcher error={error} />
        </Layout>
      )
    }

    if (LocationLayoutRoutes.includes(currentRoute)) {
      return (
        <LocationLayout>
          {this.renderPage()}
        </LocationLayout>
      )
    } else {
      return (
        <Layout footer={[LANDING_ROUTE, MAIN_DISCLAIMER_ROUTE, NOT_FOUND].includes(currentRoute) && <GeneralFooter />}
                header={
                  [MAIN_DISCLAIMER_ROUTE, NOT_FOUND].includes(currentRoute) &&
                  <GeneralHeader viewportSmall={viewportSmall} />
                }
                darkMode={darkMode}>
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
  viewportSmall: state.viewport.is.small,
  darkMode: state.darkMode
})

export default connect(mapStateToProps)(Switcher)
