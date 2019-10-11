// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import { translate } from 'react-i18next'
import type { NavigationScreenProp } from 'react-navigation'
import type { StatusPropsType } from '../../../modules/error/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/error/hocs/withPayloadProvider'
import { CityModel } from '@integreat-app/integreat-api-client'
import React from 'react'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import createNavigateToExtras from '../../../modules/app/createNavigateToExtras'
import omitNavigation from '../../../modules/common/hocs/omitNavigation'

type RefreshPropsType = {|
  cityCode: string,
  language: string,
  path: string,
  navigation: NavigationScreenProp<*>
|}

type ContainerPropsType = {|
  navigation: NavigationScreenProp<*>,
  language: string,
  cityCode: string,
  cities: $ReadOnlyArray<CityModel>,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  dispatch: Dispatch<StoreActionType>
|}

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, navigation, path } = refreshProps
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  navigateToDashboard({
    cityCode, language, path, forceUpdate: true, key: navigation.state.key
  })
}

const createChangeUnavailableLanguage = (city: string) =>
  (dispatch: Dispatch<StoreActionType>, newLanguage: string) => {
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: { newLanguage, city }
    })
  }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, switchingLanguage, languages } = state.cityContent
  const route = categoriesRouteMapping[ownProps.navigation.state.key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (state.cities.status === 'loading' || switchingLanguage || route.status === 'loading' || !languages) {
    return { status: 'loading' }
  }

  if (route.status === 'languageNotAvailable') {
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.filter(lng => route.allAvailableLanguages.has(lng.code)),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city)
    }
  }

  const refreshProps = {
    cityCode: route.city,
    language: route.language,
    path: route.path,
    navigation: ownProps.navigation
  }
  if (state.cities.status === 'error' || resourceCache.errorMessage !== undefined || route.status === 'error') {
    return { status: 'error', refreshProps }
  }

  const cities = state.cities.models
  const stateView = new CategoriesRouteStateView(route.path, route.models, route.children)
  return {
    status: 'success',
    refreshProps,
    innerProps: {
      navigation: ownProps.navigation,
      cityCode: route.city,
      language: route.language,
      cities,
      stateView,
      resourceCache
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedDashboard = translate('dashboard')(
  withTheme(props => props.language)(
    Dashboard
  ))

const DashboardContainer = (props: ContainerPropsType) => {
  const { dispatch, ...rest } = props
  return <ThemedTranslatedDashboard
    {...rest}
    navigateToCategory={createNavigateToCategory('Categories', dispatch, rest.navigation)}
    navigateToEvent={createNavigateToEvent(dispatch, rest.navigation)}
    navigateToIntegreatUrl={createNavigateToIntegreatUrl(dispatch, rest.navigation)}
    navigateToDashboard={createNavigateToCategory('Dashboard', dispatch, rest.navigation)}
    navigateToExtras={createNavigateToExtras(dispatch, rest.navigation)} />
}

export default withRouteCleaner<PropsType>(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    omitNavigation<PropsType>(
      withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
        DashboardContainer
      )
    )
  ))
