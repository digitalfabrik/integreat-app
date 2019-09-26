// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { CategoryRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
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
  navigation: NavigationScreenProp<*>
|}

type ContainerPropsType = {|
  navigation: NavigationScreenProp<*>,
  language: string,
  cityCode: string,
  cities: Array<CityModel>,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  dispatch: Dispatch<StoreActionType>
|}

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, navigation } = refreshProps
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  navigateToDashboard({
    cityCode, language, path: `/${cityCode}/${language}`, forceUpdate: true, key: navigation.state.key
  })
}

const createChangeUnavailableLanguage = (city: string, navigation: NavigationScreenProp<*>) => (
  dispatch: Dispatch<StoreActionType>, newLanguage: string
) => {
  dispatch({
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage, city }
  })
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  navigateToDashboard({
    cityCode: city,
    language: newLanguage,
    path: `/${city}/${newLanguage}`,
    forceUpdate: false,
    key: navigation.state.key
  })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, city, languages, switchingLanguage } = state.cityContent
  const route: ?CategoryRouteStateType = categoriesRouteMapping[ownProps.navigation.state.key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  const refreshProps = { cityCode: city, language: route.language, navigation: ownProps.navigation }
  if (state.cities.status === 'error' ||
    resourceCache.errorMessage !== undefined ||
    route.status === 'error') {
    return { status: 'error', refreshProps }
  }

  if (state.cities.status === 'loading' || !languages || switchingLanguage || route.status === 'loading') {
    return { status: 'loading' }
  }

  const cities = state.cities.models
  if (!languages.find(language => language.code === route.language)) {
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages,
      cityCode: city,
      refreshProps,
      changeUnavailableLanguage: createChangeUnavailableLanguage(city, ownProps.navigation)
    }
  }

  const stateView = new CategoriesRouteStateView(route.path, route.models, route.children)

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      navigation: ownProps.navigation,
      cityCode: city,
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

export default withRouteCleaner<OwnPropsType>(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    omitNavigation<PropsType>(
      withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
        DashboardContainer
      )
    )
  ))
