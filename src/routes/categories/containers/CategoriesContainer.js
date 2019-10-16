// @flow

import { connect } from 'react-redux'
import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
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
import type { TFunction } from 'i18next'
import { mapProps } from 'recompose'

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

type OwnPropsType = {| navigation: NavigationScreenProp<*>, t: TFunction |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const createChangeUnavailableLanguage = (
  path: string, navigation: NavigationScreenProp<*>, city: string, t: TFunction
) => (
  dispatch: Dispatch<StoreActionType>, newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage, city, t }
  }
  dispatch(switchContentLanguage)
  const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
  navigateToCategory({
    cityCode: city,
    language: newLanguage,
    path,
    forceUpdate: false,
    key: navigation.state.key
  })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, navigation } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, switchingLanguage } = state.cityContent
  const route = categoriesRouteMapping[navigation.state.key]

  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  const city = route.city
  const refreshProps = { cityCode: city, language: route.language, path: route.path, navigation }

  if (state.cities.status === 'error' ||
    resourceCache.errorMessage !== undefined ||
    route.status === 'error') {
    return { status: 'error', refreshProps }
  }

  if (route.status === 'loading' || switchingLanguage || state.cities.status === 'loading') {
    return { status: 'loading' }
  }

  const cities = state.cities.models
  const languages = Array.from(route.allAvailableLanguages.keys())
  const stateView = new CategoriesRouteStateView(route.path, route.models, route.children)
  if (!languages.includes(route.language)) {
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages,
      cityCode: city,
      refreshProps,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.path, navigation, city, t)
    }
  }

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      cityCode: city,
      language: route.language,
      cities,
      stateView,
      resourceCache,
      navigation
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

type RestType = $Diff<PropsType, OwnPropsType>
const removeOwnProps = (props: PropsType): RestType => {
  const { t, navigation, ...rest } = props
  return rest
}

export default withRouteCleaner<{| navigation: NavigationScreenProp<*> |}>(
  translate('error')(
    connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
      mapProps<RestType, PropsType>(removeOwnProps)(
        withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
          CategoriesContainer
        )))))
