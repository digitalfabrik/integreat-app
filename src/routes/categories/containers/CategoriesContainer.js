// @flow

import { connect } from 'react-redux'
import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import type { NavigationScreenProp } from 'react-navigation'
import type { StatusPropsType } from '../../../modules/error/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/error/hocs/withPayloadProvider'
import { CityModel } from '@integreat-app/integreat-api-client'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { translate } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import Categories from '../../../modules/categories/components/Categories'
import React from 'react'
import omitNavigation from '../../../modules/common/hocs/omitNavigation'

type ContainerPropsType = {|
  navigation: NavigationScreenProp<*>,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  dispatch: Dispatch<StoreActionType>
|}

type RefreshPropsType = {|
  cityCode: string,
  language: string,
  path: string,
  navigation: NavigationScreenProp<*>
|}

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, switchingLanguage } = state.cityContent
  const route = categoriesRouteMapping[ownProps.navigation.state.key]

  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  const city = route.city
  const refreshProps = { cityCode: city, language: route.language, path: route.path, navigation: ownProps.navigation }
  if (route.status === 'loading' || switchingLanguage || state.cities.status === 'loading') {
    return { status: 'loading' }
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
      cityCode: city,
      language: route.language,
      cities,
      stateView,
      resourceCache,
      navigation: ownProps.navigation
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, path, navigation } = refreshProps
  const navigateToCategories = createNavigateToCategory('Categories', dispatch, navigation)
  navigateToCategories({
    cityCode, language, path, forceUpdate: true, key: navigation.state.key
  })
}

class CategoriesContainer extends React.Component<ContainerPropsType> {
  render () {
    const { dispatch, ...rest } = this.props
    return <ThemedTranslatedCategories
      {...rest}
      navigateToCategory={createNavigateToCategory('Categories', dispatch, rest.navigation)}
      navigateToIntegreatUrl={createNavigateToIntegreatUrl(dispatch, rest.navigation)} />
  }
}

const ThemedTranslatedCategories = withTheme(props => props.language)(
  translate('categories')(
    Categories
  ))

export default withRouteCleaner<PropsType>(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    omitNavigation<PropsType>(
      withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
        CategoriesContainer
      ))))
