// @flow

import { connect } from 'react-redux'
import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToInternalLink from '../../../modules/app/createNavigateToInternalLink'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import { CityModel } from 'api-client'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'
import Categories from '../../../modules/categories/components/Categories'
import React from 'react'
import type { TFunction } from 'react-i18next'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import type {
  CategoriesRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import { CATEGORIES_ROUTE } from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/app/navigateToLink'
import createNavigateToFeedbackModal from '../../../modules/app/createNavigateToFeedbackModal'

type NavigationPropsType = {|
  route: RoutePropType<CategoriesRouteType>,
  navigation: NavigationPropType<CategoriesRouteType>
|}

type OwnPropsType = {|
  ...NavigationPropsType,
  t: TFunction
|}

type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type ContainerPropsType = {|
  ...OwnPropsType,
  ...DispatchPropsType,
  cityModel: CityModel,
  language: string,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string
|}

type RefreshPropsType = {|
  ...NavigationPropsType,
  cityCode: string,
  language: string,
  path: string
|}

type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const onRouteClose = (routeKey: string, dispatch: Dispatch<StoreActionType>) => {
  dispatch({ type: 'CLEAR_CATEGORY', params: { key: routeKey } })
}

const createChangeUnavailableLanguage = (city: string, t: TFunction) => (
  dispatch: Dispatch<StoreActionType>, newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage, city, t }
  }
  dispatch(switchContentLanguage)
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, route: { key } } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, categoriesRouteMapping, switchingLanguage, languages } = state.cityContent
  const route = categoriesRouteMapping[key]
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
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  } else if (route.status === 'error') {
    return { status: 'error', message: route.message, code: route.code, refreshProps }
  } else if (resourceCache.status === 'error') {
    return { status: 'error', message: resourceCache.message, code: resourceCache.code, refreshProps }
  } else if (languages.status === 'error') {
    return { status: 'error', message: languages.message, code: languages.code, refreshProps }
  }

  const resourceCacheUrl = state.resourceCacheUrl
  const { models, children, allAvailableLanguages } = route
  if (resourceCacheUrl === null || state.cities.status === 'loading' || languages.status === 'loading' ||
    (route.status === 'loading' && (!models || !allAvailableLanguages || !children))) {
    return { status: 'loading', progress: resourceCache.progress }
  }
  // $FlowFixMe Flow does not get that models and children cannot be undefined as it is already checked above
  const stateView = new CategoriesRouteStateView(route.path, route.models, route.children)

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
      resourceCache: resourceCache.value,
      resourceCacheUrl
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

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, path, navigation, route } = refreshProps
  const navigateToCategories = createNavigateToCategory(CATEGORIES_ROUTE, dispatch, navigation)
  navigateToCategories({
    cityCode, language, cityContentPath: path, forceRefresh: true, key: route.key
  })
}

class CategoriesContainer extends React.Component<ContainerPropsType> {
  navigateToLinkProp = (url: string, language: string, shareUrl: string) => {
    const { dispatch, navigation } = this.props
    const navigateToInternalLink = createNavigateToInternalLink(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateToInternalLink, shareUrl)
  }

  render () {
    const { dispatch, navigation, ...rest } = this.props

    return <ThemedTranslatedCategories
      {...rest}
      navigateToFeedback={createNavigateToFeedbackModal(navigation)}
      navigateToCategory={createNavigateToCategory(CATEGORIES_ROUTE, dispatch, navigation)}
      navigateToLink={this.navigateToLinkProp} />
  }
}

const ThemedTranslatedCategories = withTheme(
  withTranslation('categories')(Categories)
)

export default withTranslation('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withPayloadProvider<ContainerPropsType, RefreshPropsType, CategoriesRouteType>(refresh, onRouteClose)(
      CategoriesContainer
    )))
