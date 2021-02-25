// @flow

import { connect } from 'react-redux'
import { type StackHeaderProps } from '@react-navigation/stack'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { NewsRouteMappingType, NewsRouteStateType, StateType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import {
  CityModel,
  DISCLAIMER_ROUTE,
  OFFERS_ROUTE,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  POIS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE
} from 'api-client'
import isPeekingRoute from '../../endpoint/selectors/isPeekingRoute'
import { cityContentUrl, url } from '../../navigation/url'

type OwnPropsType = {|
  ...StackHeaderProps,
  t: TFunction
|}

type StatePropsType = {|
  language: mixed,
  goToLanguageChange?: () => void,
  peeking: boolean,
  categoriesAvailable: boolean,
  routeCityModel?: CityModel,
  shareUrl: ?string
|}

type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const getShareUrl = (params: {| city: mixed, language: mixed, path: ?string, routeName: string |}): ?string => {
  const { city, language, path, routeName } = params
  if (path) {
    return url(path)
  } else if ([EVENTS_ROUTE, NEWS_ROUTE, POIS_ROUTE, OFFERS_ROUTE, DISCLAIMER_ROUTE, SPRUNGBRETT_OFFER_ROUTE].includes(routeName)) {
    const params = { cityCode: city, languageCode: language, path: null }
    return cityContentUrl({ route: routeName, ...params })
  }
  return null
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.scene.route.key
  const shareUrlFromScene: ?string = typeof ownProps.scene.route.params?.shareUrl === 'string' ? ownProps.scene.route.params?.shareUrl : null
  let city, language

  let route = state.cityContent
    ? state.cityContent.categoriesRouteMapping[routeKey] ||
    state.cityContent.eventsRouteMapping[routeKey] ||
    state.cityContent.newsRouteMapping[routeKey] ||
    state.cityContent.poisRouteMapping[routeKey]
    : null

  if (route) {
    city = route.city
    language = route.language
  } else if (([OFFERS_ROUTE, DISCLAIMER_ROUTE, SPRUNGBRETT_OFFER_ROUTE]).includes(ownProps.scene.route.name) || shareUrlFromScene) {
    route = ownProps.scene.route
    route.status = 'ready'
    city = route.params.cityCode
    language = route.params.languageCode
  }

  const languages = state.cityContent?.languages

  // prevent re-rendering when city is there.
  const cities = state.cities.models || []
  const stateCityCode = state.cityContent?.city
  const categoriesAvailable = state.cityContent?.searchRoute !== null

  const routeCityModel = route ? cities.find(cityElem => cityElem.code === city) : undefined

  if (!route || route.status !== 'ready' || state.cities.status !== 'ready' || !state.cityContent ||
    !languages || languages.status !== 'ready') {
    // Route does not exist yet. In this case it is not really defined whether we are peek or not because
    // we do not yet know the city of the route.
    return {
      language: state.contentLanguage,
      routeCityModel,
      peeking: false,
      categoriesAvailable: false,
      shareUrl: null
    }
  }

  const goToLanguageChange = () => {
    ownProps.navigation.navigate({
      name: CHANGE_LANGUAGE_MODAL_ROUTE,
      params: {
        currentLanguage: route.language,
        languages: languages.models,
        cityCode: stateCityCode,
        availableLanguages: Array.from(route.allAvailableLanguages.keys()),
        previousKey: routeKey
      }
    })
  }

  const peeking = isPeekingRoute(state, { routeCity: route.city })
  const path = route.path || null
  let shareUrl = shareUrlFromScene || getShareUrl({ city, language, path, routeName: ownProps.scene.route.name })

  if (ownProps.scene.route.name === NEWS_ROUTE) {
    shareUrl = `${shareUrl}/${route.type}`
  }

  return { peeking, routeCityModel, language, goToLanguageChange, categoriesAvailable, shareUrl }
}

export default withTranslation('layout')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
    withTheme(Header)
  )
)
