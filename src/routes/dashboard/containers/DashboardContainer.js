// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { CategoryRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import { translate } from 'react-i18next'
import type { NavigationScreenProp } from 'react-navigation'
import type { StatusPropsType } from '../../../modules/error/hocs/withError'
import withError from '../../../modules/error/hocs/withError'
import { CityModel } from '@integreat-app/integreat-api-client'
import React from 'react'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import createNavigateToExtras from '../../../modules/app/createNavigateToExtras'

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

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, navigation } = refreshProps
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  navigateToDashboard({
    cityCode, language, path: `/${cityCode}/${language}`, forceUpdate: true, key: navigation.getParam('key')
  })
}

const changeUnavailableLanguage = (
  dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>, city: string, newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: {
      city,
      newLanguage
    }
  }
  dispatch(switchContentLanguage)
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  navigateToDashboard({
    cityCode: city,
    language: newLanguage,
    path: `/${city}/${newLanguage}`,
    forceUpdate: false,
    key: navigation.getParam('key')
  })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const language = state.contentLanguage
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, city, languages, switchingLanguage } = state.cityContent
  const route: ?CategoryRouteStateType = categoriesRouteMapping[ownProps.navigation.getParam('key')]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (state.cities.errorMessage !== undefined ||
    categoriesRouteMapping.errorMessage !== undefined ||
    resourceCache.errorMessage !== undefined) {
    return { status: 'error', refreshProps: { cityCode: city, language, navigation: ownProps.navigation } }
  }

  const cities = state.cities.models

  if (!cities || !languages || switchingLanguage) {
    return { status: 'loading' }
  }

  if (!languages.find(lng => lng.code === language)) {
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages,
      cityCode: city,
      refreshProps: { cityCode: city, language, navigation: ownProps.navigation },
      changeUnavailableLanguage
    }
  }

  const stateView = new CategoriesRouteStateView(route.root, route.models, route.children)

  return {
    status: 'success',
    refreshProps: { cityCode: city, language, navigation: ownProps.navigation },
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

export default withRouteCleaner<*>(
  connect<_, _, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withError<ContainerPropsType, RefreshPropsType>(refresh)(
      DashboardContainer
    )
  ))
