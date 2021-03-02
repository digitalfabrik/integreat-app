// @flow

import { connect } from 'react-redux'
import { type StackHeaderProps } from '@react-navigation/stack'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import Header, { type PropsType as HeaderPropsType } from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { StateType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import {
  CityModel,
  DISCLAIMER_ROUTE,
  OFFERS_ROUTE,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
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

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.scene.route.key
  const shareUrlFromScene: ?string = typeof ownProps.scene.route.params?.shareUrl === 'string' ? ownProps.scene.route.params?.shareUrl : null

  const route = state.cityContent
    ? state.cityContent.categoriesRouteMapping[routeKey] ||
    state.cityContent.eventsRouteMapping[routeKey] ||
    state.cityContent.newsRouteMapping[routeKey] ||
    state.cityContent.poisRouteMapping[routeKey]
    : null

  if (([OFFERS_ROUTE, DISCLAIMER_ROUTE, SPRUNGBRETT_OFFER_ROUTE]).includes(ownProps.scene.route.name) || shareUrlFromScene) {
    const propsRoute = ownProps.scene.route
    let shareUrl

    if (state.cityContent?.city && !shareUrlFromScene) {
      shareUrl = cityContentUrl(
        {
          cityCode: state.cityContent?.city,
          languageCode: state.contentLanguage,
          route: propsRoute.name,
          path: null
        })
    }

    return {
      language: propsRoute.params?.languageCode,
      routeCityModel: undefined,
      peeking: false,
      categoriesAvailable: false,
      shareUrl: shareUrlFromScene || shareUrl
    }
  }

  const languages = state.cityContent?.languages

  // prevent re-rendering when city is there.
  const cities = state.cities.models || []
  const stateCityCode = state.cityContent?.city
  const categoriesAvailable = state.cityContent?.searchRoute !== null

  const routeCityModel = route ? cities.find(cityElem => cityElem.code === route.city) : undefined

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
  const path = route.path || undefined
  const language = route.language
  let shareUrl = url(path) // getShareUrl({ city, language, path, routeName: ownProps.scene.route.name })

  if (ownProps.scene.route.name === NEWS_ROUTE && route?.type && stateCityCode) {
    shareUrl = cityContentUrl({ cityCode: stateCityCode, languageCode: language, route: NEWS_ROUTE, path: route.type })
  }

  if (ownProps.scene.route.name === EVENTS_ROUTE && !path && stateCityCode) {
    shareUrl = cityContentUrl({ cityCode: stateCityCode, languageCode: language, route: EVENTS_ROUTE, path: null })
  }

  return { peeking, routeCityModel, language, goToLanguageChange, categoriesAvailable, shareUrl }
}

export default withTranslation<OwnPropsType>('layout')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
    withTheme<HeaderPropsType>(Header)
  )
)
