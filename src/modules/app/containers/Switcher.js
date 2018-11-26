// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import {
  Payload,
  PoiModel,
  WohnenOfferModel,
  EventModel,
  CategoriesMapModel,
  ExtraModel,
  CityModel,
  PageModel,
  LanguageModel
} from '@integreat-app/integreat-api-client'
import LanguageNotFoundError from '../errors/LanguageNotFoundError'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import { NOT_FOUND } from 'redux-first-router'
import CityNotFoundError from '../errors/CityNotFoundError'
import LoadingSpinner from '../../common/components/LoadingSpinner'
import Layout from '../../layout/components/Layout'
import LocationLayout from '../../layout/containers/LocationLayout'
import GeneralHeader from '../../layout/components/GeneralHeader'
import GeneralFooter from '../../layout/components/GeneralFooter'
import type { StateType } from '../StateType'
import { LANDING_ROUTE } from '../route-configs/LandingRouteConfig'
import { MAIN_DISCLAIMER_ROUTE } from '../route-configs/MainDisclaimerRouteConfig'
import { getRouteConfig, LocationLayoutRoutes } from '../route-configs'
import { getRouteContent } from '../routeContents'
import reduce from 'lodash/reduce'
import find from 'lodash/find'
import Helmet from '../../common/containers/Helmet'
import type { Location, Dispatch } from 'redux-first-router'
import { withNamespaces } from 'react-i18next'
import compose from 'lodash/fp/compose'
import type { TFunction } from 'react-i18next'
import type { RouteConfig } from '../route-configs/RouteConfig'
import toggleDarkModeAction from '../../theme/actions/toggleDarkMode'

type PropsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettExtraPage>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>,
  languages: ?Array<LanguageModel>,
  viewportSmall: boolean,
  darkMode: boolean,
  location: Location,
  toggleDarkMode: () => void,
  t: TFunction
|}

/**
 * Switches what content should be rendered depending on the current route
 */
export class Switcher extends React.Component<PropsType> {
  /**
   * Renders a failure component if a payload contains an error or a LoadingSpinner if the data is still being fetched
   * @param payloads The payloads to check for errors or fetching process
   */
  static renderFailureLoadingComponents = (payloads: {[string]: Payload<any>}): React.Node => {
    const errorPayload = find(payloads, payload => payload.error)
    if (find(payloads, payload => (payload.isFetching || !payload.data) && !payload.error)) {
      return <LoadingSpinner />
    } else if (errorPayload) {
      return <FailureSwitcher error={errorPayload.error} />
    }
    return null
  }

  getRequiredPayloads = (routeConfig: RouteConfig<*, *>) => {
    const {
      citiesPayload, eventsPayload, categoriesPayload, extrasPayload, disclaimerPayload,
      sprungbrettJobsPayload, wohnenPayload, poisPayload
    } = this.props
    const allPayloads = {
      citiesPayload,
      eventsPayload,
      categoriesPayload,
      extrasPayload,
      disclaimerPayload,
      sprungbrettJobsPayload,
      wohnenPayload,
      poisPayload
    }
    return routeConfig.getRequiredPayloads(allPayloads)
  }

  renderPage = (): React.Node => {
    const {location, citiesPayload, t} = this.props

    const currentRoute = location.type

    if (currentRoute === NOT_FOUND) {
      // The only possibility to be in the NOT_FOUND route is if we have "/:param" as path and the param is neither
      // "disclaimer" nor a city, so we want to show an error that the param is not an available city
      const param = location.prev.payload.param
      if (param) {
        const error = new CityNotFoundError({city: param})
        return <FailureSwitcher error={error} />
      }
    }
    const RouteContent = getRouteContent(currentRoute)
    const routeConfig = getRouteConfig(currentRoute)
    const payloads = this.getRequiredPayloads(routeConfig)
    const cityModel = citiesPayload.data && CityModel.findCityName(citiesPayload.data, location.payload.city)
    const pageTitle = routeConfig.getPageTitle({t, payloads, cityName: cityModel.name, location})
    const metaDescription = routeConfig.getMetaDescription(t)

    return Switcher.renderFailureLoadingComponents(payloads) ||
      <>
        <Helmet pageTitle={pageTitle} metaDescription={metaDescription} />
        <RouteContent {...reduce(payloads, (result, value, key: string) => ({[key]: value.data, ...result}), {})} />
      </>
  }

  /**
   * Checks whether the city and language params are valid
   * @return {*}
   */
  checkRouteParams (): ?Error {
    const {location, citiesPayload, languages} = this.props
    const {city, language} = location.payload
    if (city && citiesPayload.data && !citiesPayload.data.find(_city => _city.code === city)) {
      return new CityNotFoundError({city})
    } else if (language && city && citiesPayload.data && languages && !languages.find(lang => lang.code === language)) {
      return new LanguageNotFoundError({city, language})
    }
    return null
  }

  render () {
    const {location, viewportSmall, darkMode, categoriesPayload, citiesPayload, toggleDarkMode} = this.props
    const currentRoute = location.type

    const error = this.checkRouteParams()
    if (error) {
      return (
        <Layout header={<GeneralHeader viewportSmall={viewportSmall} />} footer={<GeneralFooter />} darkMode={darkMode}>
          <FailureSwitcher error={error} />
        </Layout>
      )
    }

    if (LocationLayoutRoutes.includes(currentRoute)) {
      const routeConfig = getRouteConfig(location.type)
      const payloads = this.getRequiredPayloads(routeConfig)
      const feedbackReference = routeConfig.getFeedbackReference({location, payloads})
      return (
        <LocationLayout feedbackReference={feedbackReference}
                        location={location}
                        categories={categoriesPayload.data}
                        cities={citiesPayload.data}
                        darkMode={darkMode}
                        viewportSmall={viewportSmall}
                        toggleDarkMode={toggleDarkMode}>
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
  citiesPayload: state.cities,
  categoriesPayload: state.categories,
  eventsPayload: state.events,
  poisPayload: state.pois,
  extrasPayload: state.extras,
  sprungbrettJobsPayload: state.sprungbrettJobs,
  wohnenPayload: state.wohnen,
  disclaimerPayload: state.disclaimer,
  languages: state.languages.data,
  viewportSmall: state.viewport.is.small,
  darkMode: state.darkMode,
  location: state.location
})

// fixme: WEBAPP-400 Dispatch type is not correct
const mapDispatchToProps = (dispatch: Dispatch<{ type: 'TOGGLE_DARK_MODE' }>) => ({
  toggleDarkMode: () => dispatch(toggleDarkModeAction())
})

// $FlowFixMe https://github.com/facebook/flow/issues/7125
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNamespaces('app')
)(Switcher)
