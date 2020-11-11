// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { CategoryRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { type TFunction, withTranslation } from 'react-i18next'
import type { NavigationStackProp } from 'react-navigation-stack'
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

type RefreshPropsType = {|
  cityCode: string,
  language: string,
  path: string,
  navigation: NavigationStackProp<*>
|}

type ContainerPropsType = {|
  navigation: NavigationStackProp<*>,
  language: string,
  cityCode: string,
  cities: $ReadOnlyArray<CityModel>,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  dispatch: Dispatch<StoreActionType>
|}

type OwnPropsType = {| navigation: NavigationStackProp<*>, t: TFunction |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, navigation, path } = refreshProps
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  navigateToDashboard({
    cityCode, language, path, forceRefresh: true, key: navigation.state.key
  })
}

const createChangeUnavailableLanguage = (city: string, t: TFunction) =>
  (dispatch: Dispatch<StoreActionType>, newLanguage: string) => {
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: { newLanguage, city, t }
    })
  }

const routeHasOldContent = (route: CategoryRouteStateType): boolean =>
  !!route.models && !!route.allAvailableLanguages && !!route.children

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, navigation } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, switchingLanguage, languages } = state.cityContent
  const route = categoriesRouteMapping[navigation.state.key]
  if (!route) {
    return { status: 'routeNotInitialized' }
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
    navigation: ownProps.navigation
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

  if (state.resourceCacheUrl === null || state.cities.status === 'loading' || switchingLanguage ||
    (route.status === 'loading' && !routeHasOldContent(route)) || languages.status === 'loading') {
    return { status: 'loading' }
  }

  const cities = state.cities.models
  const stateView = new CategoriesRouteStateView(route.path, route.models, route.children)
  // $FlowFixMe Flow can't evaluate the status as it is dynamic
  return {
    status: route.status === 'loading' ? 'loading' : 'success',
    refreshProps,
    innerProps: {
      navigation,
      cityCode: route.city,
      language: route.language,
      cities,
      stateView,
      resourceCacheUrl: state.resourceCacheUrl,
      resourceCache: resourceCache.value
    }
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
    navigateToCategory={createNavigateToCategory('Categories', dispatch, rest.navigation)}
    navigateToEvent={createNavigateToEvent(dispatch, rest.navigation)}
    navigateToNews={createNavigateToNews(dispatch, rest.navigation)}
    navigateToInternalLink={createNavigateToInternalLink(dispatch, rest.navigation)}
    navigateToDashboard={createNavigateToCategory('Dashboard', dispatch, rest.navigation)}
    navigateToOffers={createNavigateToOffers(dispatch, rest.navigation)} />
}

export default withRouteCleaner<{| navigation: NavigationStackProp<*> |}>(
  withTranslation('error')(
    connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
      withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
        DashboardContainer
      ))))
