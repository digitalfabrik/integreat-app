// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import SprungbrettOfferPage from '../../../routes/sprungbrett/containers/SprungbrettOfferPage'
import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  OfferModel,
  LanguageModel,
  LocalNewsModel,
  PageModel,
  Payload,
  PoiModel,
  TunewsModel,
  WohnenOfferModel
} from 'api-client'
import Layout from '../../layout/components/Layout'
import LocationLayout from '../../layout/containers/LocationLayout'
import GeneralHeader from '../../layout/components/GeneralHeader'
import GeneralFooter from '../../layout/components/GeneralFooter'
import type { StateType } from '../StateType'
import { getRouteConfig } from '../route-configs'
import Helmet from '../../common/containers/Helmet'
import type { Dispatch } from 'redux'
import type { LocationState } from 'redux-first-router'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { RouteConfig } from '../route-configs/RouteConfig'
import toggleDarkModeAction from '../../theme/actions/toggleDarkMode'
import LanguageFailure from '../../common/containers/LanguageFailure'
import RouteContentSwitcher from './RouteContentSwitcher'
import type { StoreActionType } from '../StoreActionType'
import FailureSwitcher from '../../common/components/FailureSwitcher'

export type LanguageChangePathsType = Array<{| code: string, path: string | null, name: string |}>

type PropsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  localNewsPayload: Payload<Array<LocalNewsModel>>,
  localNewsElementPayload: Payload<LocalNewsModel>,
  tunewsPayload: Payload<Array<TunewsModel>>,
  tunewsLanguagesPayload: Payload<Array<LanguageModel>>,
  tunewsElementPayload: Payload<TunewsModel>,
  offersPayload: Payload<Array<OfferModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettOfferPage>>,
  wohnenOffersPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>,
  languagesPayload: Payload<Array<LanguageModel>>,
  viewportSmall: boolean,
  darkMode: boolean,
  location: LocationState,
  toggleDarkMode: () => void,
  t: TFunction
|}

/**
 * Switches what content should be rendered depending on the current route
 */
export class Switcher extends React.Component<PropsType> {
  getAllPayloads = () => {
    const { location, languagesPayload, viewportSmall, darkMode, toggleDarkMode, t, ...payloads } = this.props
    return payloads
  }

  getLanguageChangePaths = (routeConfig: RouteConfig<*, *>): ?LanguageChangePathsType => {
    const { languagesPayload, location } = this.props
    const payloads = routeConfig.getRequiredPayloads(this.getAllPayloads())
    return languagesPayload.data && languagesPayload.data.map(language => ({
      path: routeConfig.getLanguageChangePath({ payloads, location, language: language.code }),
      name: language.name,
      code: language.code
    }))
  }

  renderHelmet = (): React.Node => {
    const { location, citiesPayload, t } = this.props
    const routeConfig = getRouteConfig(location.type)
    const payloads = routeConfig.getRequiredPayloads(this.getAllPayloads())
    const cityModel = citiesPayload.data && citiesPayload.data.find(city => city.code === location.payload.city)
    const pageTitle = routeConfig.getPageTitle({ t, payloads, cityName: cityModel ? cityModel.name : '', location })
    const metaDescription = routeConfig.getMetaDescription(t)
    const languageChangePaths = this.getLanguageChangePaths(routeConfig)
    return (
      <Helmet pageTitle={pageTitle}
              metaDescription={metaDescription}
              languageChangePaths={languageChangePaths}
              cityModel={cityModel} />
    )
  }

  isLanguageInvalid (): boolean {
    const { location, languagesPayload } = this.props
    const { language } = location.payload
    return language && !!languagesPayload.data && !languagesPayload.data.find(lang => lang.code === language)
  }

  renderLayoutWithContent (): React.Node {
    const {
      location,
      viewportSmall,
      darkMode,
      categoriesPayload,
      citiesPayload,
      toggleDarkMode,
      eventsPayload
    } = this.props

    const { language, city } = location.payload

    const routeConfig = getRouteConfig(location.type)
    const payloads = routeConfig.getRequiredPayloads(this.getAllPayloads())
    const feedbackTargetInformation = routeConfig.getFeedbackTargetInformation({ location, payloads })
    const languageChangePaths = this.getLanguageChangePaths(routeConfig)
    const cities = this.getAllPayloads().citiesPayload.data

    const invalidLanguage = this.isLanguageInvalid()

    const isLoading = Object.keys(payloads).some(key => {
      const payload = payloads[key]
      return (payload.isFetching || !payload.data) && !payload.error
    })

    if (!cities) {
      return null
    }

    const invalidCity = city && !cities.find(_city => _city.code === city)

    if (invalidCity || invalidLanguage || !routeConfig.isLocationLayoutRoute) {
      const showHeader = invalidLanguage || routeConfig.requiresHeader
      const showFooter = (invalidLanguage || routeConfig.requiresFooter) && !isLoading
      return (
        <Layout footer={showFooter && <GeneralFooter language={language} />}
                header={showHeader && <GeneralHeader viewportSmall={viewportSmall} />}
                darkMode={darkMode}>
          {invalidCity ? <FailureSwitcher error={new Error('notFound.category')} /> : null}
          {invalidLanguage
            ? <LanguageFailure cities={citiesPayload.data}
                               location={location}
                               languageChangePaths={languageChangePaths} />
            : null}
          {!invalidCity && !invalidLanguage
            ? <RouteContentSwitcher location={location} payloads={payloads} isLoading={isLoading} />
            : null}
        </Layout>
      )
    } else {
      return (
        <LocationLayout feedbackTargetInformation={feedbackTargetInformation}
                        location={location}
                        categories={categoriesPayload.data}
                        cities={citiesPayload.data}
                        events={eventsPayload.data}
                        darkMode={darkMode}
                        viewportSmall={viewportSmall}
                        toggleDarkMode={toggleDarkMode}
                        languageChangePaths={languageChangePaths}
                        isLoading={isLoading}>
          <RouteContentSwitcher location={location} payloads={payloads} isLoading={isLoading} />
        </LocationLayout>
      )
    }
  }

  render () {
    return (
      <>
        {this.renderHelmet()}
        {this.renderLayoutWithContent()}
      </>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  citiesPayload: state.cities,
  categoriesPayload: state.categories,
  eventsPayload: state.events,
  localNewsPayload: state.localNews,
  localNewsElementPayload: state.localNewsElement,
  tunewsPayload: state.tunews.payload,
  tunewsLanguagesPayload: state.tunewsLanguages,
  tunewsElementPayload: state.tunewsElement,
  poisPayload: state.pois,
  offersPayload: state.offers,
  sprungbrettJobsPayload: state.sprungbrettJobs,
  wohnenOffersPayload: state.wohnen,
  disclaimerPayload: state.disclaimer,
  languagesPayload: state.languages,
  viewportSmall: state.viewport.is.small,
  darkMode: state.darkMode,
  location: state.location
})

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  toggleDarkMode: () => dispatch(toggleDarkModeAction())
})

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(
  withTranslation('app')(
    Switcher
  ))
