// @flow

import type { Dispatch } from 'redux'
import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { CategoryRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { type TFunction, withTranslation } from 'react-i18next'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import { CityModel } from 'api-client'
import React from 'react'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import createNavigateToInternalLink from '../../../modules/app/createNavigateToInternalLink'
import createNavigateToPoi from '../../../modules/app/createNavigateToPoi'
import createNavigateToOffers from '../../../modules/app/createNavigateToOffers'
import createNavigateToNews from '../../../modules/app/createNavigateToNews'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import type {
  DashboardRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'
import { CATEGORIES_ROUTE, DASHBOARD_ROUTE } from '../../../modules/app/components/NavigationTypes'

type NavigationPropsType = {|
  route: RoutePropType<DashboardRouteType>,
  navigation: NavigationPropType<DashboardRouteType>
|}

type OwnPropsType = {|
  ...NavigationPropsType,
  t: TFunction
|}

type RefreshPropsType = {|
  ...NavigationPropsType,
  cityCode: string,
  language: string,
  path: string
|}

type ContainerPropsType = {|
  ...OwnPropsType,
  language: string,
  cityModel: CityModel,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  dispatch: Dispatch<StoreActionType>
|}

type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, navigation, route, path } = refreshProps
  const navigateToDashboard = createNavigateToCategory(DASHBOARD_ROUTE, dispatch, navigation)
  navigateToDashboard({
    cityCode,
    language,
    cityContentPath: path,
    forceRefresh: true,
    key: route.key
  })
}

const createChangeUnavailableLanguage = (city: string, t: TFunction) =>
  (dispatch: Dispatch<StoreActionType>, newLanguage: string) => {
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: { newLanguage, city, t }
    })
  }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, route: { key } } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, switchingLanguage, languages } = state.cityContent
  const route: ?CategoryRouteStateType = categoriesRouteMapping[key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (switchingLanguage) {
    return {
      status: 'loading',
      progress: resourceCache.progress ? resourceCache.progress : 0
    }
  }

  if (route.status === 'languageNotAvailable') {
    if (languages.status === 'error' || languages.status === 'loading') {
      console.error('languageNotAvailable status impossible if languages not ready')
      return {
        status: 'error',
        refreshProps: null,
        code: languages.code || ErrorCodes.UnknownError,
        message: languages.message || 'languages not ready'
      }
    }
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.models.filter(lng => route.allAvailableLanguages.has(lng.code)),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city, t)
    }
  }

  const refreshProps = {
    cityCode: route.city,
    language: route.language,
    path: route.path,
    navigation: ownProps.navigation,
    route: ownProps.route
  }

  if (state.cities.status === 'error') {
    return { status: 'error', refreshProps, message: state.cities.message, code: state.cities.code }
  } else if (resourceCache.status === 'error') {
    return { status: 'error', refreshProps, message: resourceCache.message, code: resourceCache.code }
  } else if (route.status === 'error') {
    return { status: 'error', refreshProps, message: route.message, code: route.code }
  } else if (languages.status === 'error') {
    return { status: 'error', message: languages.message, code: languages.code, refreshProps }
  }

  const resourceCacheUrl = state.resourceCacheUrl
  const { models, children, allAvailableLanguages } = route
  if (resourceCacheUrl === null || state.cities.status === 'loading' || languages.status === 'loading' ||
    (route.status === 'loading' && (!models || !allAvailableLanguages || !children))) {
    return {
      status: 'loading',
      progress: resourceCache.progress
    }
  }
  // $FlowFixMe Flow does not get that models and children cannot be undefined as it is already checked above
  const stateView = new CategoriesRouteStateView(route.path, models, children)

  const cityModel = state.cities.models.find(city => city.code === route.city)
  if (!cityModel) {
    return { status: 'error', refreshProps, message: 'Unknown city', code: ErrorCodes.PageNotFound }
  }

  const successProps = {
    refreshProps,
    innerProps: {
      ...ownProps,
      cityModel,
      language: route.language,
      stateView,
      resourceCacheUrl: resourceCacheUrl,
      resourceCache: resourceCache.value
    }
  }

  if (route.status === 'loading') {
    return {
      ...successProps,
      progress: resourceCache.progress,
      status: 'loading'
    }
  }

  return {
    ...successProps,
    status: 'success'
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedDashboard = withTranslation('dashboard')(
  withTheme(Dashboard)
)

const DashboardContainer = (props: ContainerPropsType) => {
  const { dispatch, ...rest } = props
  return <ThemedTranslatedDashboard
    {...rest}
    navigateToPoi={createNavigateToPoi(dispatch, rest.navigation)}
    navigateToCategory={createNavigateToCategory(CATEGORIES_ROUTE, dispatch, rest.navigation)}
    navigateToEvent={createNavigateToEvent(dispatch, rest.navigation)}
    navigateToNews={createNavigateToNews(dispatch, rest.navigation)}
    navigateToInternalLink={createNavigateToInternalLink(dispatch, rest.navigation)}
    navigateToDashboard={createNavigateToCategory(DASHBOARD_ROUTE, dispatch, rest.navigation)}
    navigateToOffers={createNavigateToOffers(dispatch, rest.navigation)} />
}

export default withTranslation('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withPayloadProvider<ContainerPropsType, RefreshPropsType, DashboardRouteType>(refresh)(
      DashboardContainer
    )))
