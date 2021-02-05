// @flow

import { connect } from 'react-redux'
import { type StackHeaderProps } from '@react-navigation/stack'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { StateType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import { CityModel } from 'api-client'
import isPeekingRoute from '../../endpoint/selectors/isPeekingRoute'
import {
  CATEGORIES_ROUTE,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE
} from '../../app/constants/NavigationTypes'

type OwnPropsType = {|
  ...StackHeaderProps,
  t: TFunction
|}

type StatePropsType = {|
  language: string,
  goToLanguageChange?: () => void,
  peeking: boolean,
  categoriesAvailable: boolean,
  routeCityModel?: CityModel,
  routeMappingType?: string | null,
  path?: string | null
|}

type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.scene.route.key

  const route = state.cityContent
    ? state.cityContent.categoriesRouteMapping[routeKey] ||
      state.cityContent.eventsRouteMapping[routeKey] ||
      state.cityContent.newsRouteMapping[routeKey]
    : null

  const languages = state.cityContent?.languages

  let routeMappingType = null

  if (state.cityContent) {
    if (state.cityContent.categoriesRouteMapping[routeKey]) { // TODO refactor in #450
      routeMappingType = CATEGORIES_ROUTE
    } else if (state.cityContent.eventsRouteMapping[routeKey]) {
      routeMappingType = EVENTS_ROUTE
    } else if (state.cityContent.newsRouteMapping[routeKey]) {
      routeMappingType = NEWS_ROUTE
    }
  }

  // prevent re-rendering when city is there.
  const cities = state.cities.models || []
  const stateCityCode = state.cityContent?.city
  const categoriesAvailable = state.cityContent?.searchRoute !== null

  const routeCityModel = route ? cities.find(city => city.code === route.city) : undefined

  if (!route || route.status !== 'ready' || state.cities.status !== 'ready' || !state.cityContent ||
    !languages || languages.status !== 'ready') {
    // Route does not exist yet. In this case it is not really defined whether we are peek or not because
    // we do not yet know the city of the route.
    return {
      language: state.contentLanguage,
      routeCityModel,
      peeking: false,
      categoriesAvailable: false
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

  const path = route.path ? route.path : null

  return {
    peeking,
    routeCityModel,
    language: route.language,
    path,
    routeMappingType,
    goToLanguageChange,
    categoriesAvailable
  }
}

export default withTranslation('layout')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
    withTheme(Header)
  )
)
