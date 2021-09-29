import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { CATEGORIES_ROUTE, CategoriesRouteType, CityModel, ErrorCode } from 'api-client'

import Categories, { PropsType as CategoriesPropsType } from '../components/Categories'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withPayloadProvider, { StatusPropsType } from '../hocs/withPayloadProvider'
import withTheme from '../hocs/withTheme'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import createNavigate from '../navigation/createNavigate'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import navigateToLink from '../navigation/navigateToLink'
import { LanguageResourceCacheStateType, StateType } from '../redux/StateType'
import { StoreActionType, SwitchContentLanguageActionType } from '../redux/StoreActionType'

type NavigationPropsType = {
  route: RoutePropType<CategoriesRouteType>
  navigation: NavigationPropType<CategoriesRouteType>
}
type OwnPropsType = NavigationPropsType
type DispatchPropsType = {
  dispatch: Dispatch<StoreActionType>
}
type ContainerPropsType = OwnPropsType &
  DispatchPropsType & {
    cityModel: CityModel
    language: string
    stateView: CategoriesRouteStateView
    resourceCache: LanguageResourceCacheStateType
    resourceCacheUrl: string
  }
type RefreshPropsType = NavigationPropsType & {
  cityCode: string
  language: string
  path: string
}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>

const onRouteClose = (routeKey: string, dispatch: Dispatch<StoreActionType>) => {
  dispatch({
    type: 'CLEAR_ROUTE',
    params: {
      key: routeKey
    }
  })
}

const createChangeUnavailableLanguage = (city: string) => (
  dispatch: Dispatch<StoreActionType>,
  newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: {
      newLanguage,
      city
    }
  }
  dispatch(switchContentLanguage)
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const {
    route: { key }
  } = ownProps

  if (!state.cityContent) {
    return {
      status: 'routeNotInitialized'
    }
  }

  const { resourceCache, routeMapping, switchingLanguage, languages } = state.cityContent
  const route = routeMapping[key]

  if (!route || route.routeType !== CATEGORIES_ROUTE) {
    return {
      status: 'routeNotInitialized'
    }
  }

  if (switchingLanguage) {
    return {
      status: 'loading',
      progress: resourceCache.status === 'ready' ? resourceCache.progress : 0
    }
  }

  if (route.status === 'languageNotAvailable') {
    if (languages.status === 'error' || languages.status === 'loading') {
      // eslint-disable-next-line no-console
      console.error('languageNotAvailable status impossible if languages not ready')
      return {
        status: 'error',
        refreshProps: null,
        code: languages.status === 'error' ? languages.code : ErrorCode.UnknownError,
        message: languages.status === 'error' ? languages.message : 'languages not ready'
      }
    }

    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.models.filter(lng => route.allAvailableLanguages.has(lng.code)),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city)
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
    return {
      status: 'error',
      message: state.cities.message,
      code: state.cities.code,
      refreshProps
    }
  } else if (route.status === 'error') {
    return {
      status: 'error',
      message: route.message,
      code: route.code,
      refreshProps
    }
  } else if (resourceCache.status === 'error') {
    return {
      status: 'error',
      message: resourceCache.message,
      code: resourceCache.code,
      refreshProps
    }
  } else if (languages.status === 'error') {
    return {
      status: 'error',
      message: languages.message,
      code: languages.code,
      refreshProps
    }
  }

  const { resourceCacheUrl } = state
  const { models, children, allAvailableLanguages } = route

  if (
    resourceCacheUrl === null ||
    state.cities.status === 'loading' ||
    languages.status === 'loading' ||
    (route.status === 'loading' && (!models || !allAvailableLanguages || !children))
  ) {
    return {
      status: 'loading',
      progress: resourceCache.progress
    }
  }

  const stateView = new CategoriesRouteStateView(route.path, models ?? {}, children ?? {})
  const cityModel = state.cities.models.find(city => city.code === route.city)

  if (!cityModel) {
    return {
      status: 'error',
      refreshProps,
      message: 'Unknown city',
      code: ErrorCode.PageNotFound
    }
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
    return { ...successProps, progress: resourceCache.progress, status: 'loading' }
  }

  return { ...successProps, status: 'success' }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  dispatch
})

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, path, navigation, route } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: CATEGORIES_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path
    },
    route.key,
    true
  )
}

const ThemedCategories = withTheme<CategoriesPropsType>(Categories)

class CategoriesContainer extends React.Component<ContainerPropsType> {
  navigateToLinkProp = (url: string, language: string, shareUrl: string) => {
    const { dispatch, navigation } = this.props
    const navigateTo = createNavigate(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateTo, shareUrl)
  }

  render() {
    const { dispatch, navigation, route, ...rest } = this.props
    return (
      <ThemedCategories
        {...rest}
        navigateToFeedback={createNavigateToFeedbackModal(navigation)}
        navigateTo={createNavigate(dispatch, navigation)}
        navigateToLink={this.navigateToLinkProp}
      />
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  // @ts-ignore
  withPayloadProvider<ContainerPropsType, RefreshPropsType, CategoriesRouteType>(
    refresh,
    onRouteClose
  )(CategoriesContainer)
)
