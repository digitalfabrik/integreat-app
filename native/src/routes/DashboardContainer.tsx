import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { DASHBOARD_ROUTE, DashboardRouteType, CATEGORIES_ROUTE, CityModel, ErrorCode } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withPayloadProvider, { StatusPropsType } from '../hocs/withPayloadProvider'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import createNavigate from '../navigation/createNavigate'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import navigateToLink from '../navigation/navigateToLink'
import { LanguageResourceCacheStateType, StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import Dashboard from './Dashboard'

type NavigationPropsType = {
  route: RoutePropType<DashboardRouteType>
  navigation: NavigationPropType<DashboardRouteType>
}
type OwnPropsType = NavigationPropsType
type RefreshPropsType = NavigationPropsType & {
  cityCode: string
  language: string
  path: string
}
type ContainerPropsType = OwnPropsType & {
  language: string
  cityModel: CityModel
  stateView: CategoriesRouteStateView
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  dispatch: Dispatch<StoreActionType>
}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {
  dispatch: Dispatch<StoreActionType>
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, navigation, route, path } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: DASHBOARD_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path
    },
    route.key,
    true
  )
}

const createChangeUnavailableLanguage = (city: string) => (
  dispatch: Dispatch<StoreActionType>,
  newLanguage: string
) => {
  dispatch({
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: {
      newLanguage,
      city
    }
  })
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
      refreshProps,
      message: state.cities.message,
      code: state.cities.code
    }
  } else if (resourceCache.status === 'error') {
    return {
      status: 'error',
      refreshProps,
      message: resourceCache.message,
      code: resourceCache.code
    }
  } else if (route.status === 'error') {
    return {
      status: 'error',
      refreshProps,
      message: route.message,
      code: route.code
    }
  } else if (languages.status === 'error') {
    return {
      status: 'error',
      message: languages.message,
      code: languages.code,
      refreshProps
    }
  }

  const resourceCacheUrl = state.resourceCacheUrl
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

  // @ts-ignore ts does not get that models and children cannot be undefined as it is already checked above
  const stateView = new CategoriesRouteStateView(route.path, models, children)
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
      resourceCacheUrl: resourceCacheUrl,
      resourceCache: resourceCache.value
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

const DashboardContainer = (props: ContainerPropsType) => {
  const { dispatch, navigation, route, ...rest } = props
  const navigateToLinkProp = useCallback(
    (url: string, language: string, shareUrl: string) => {
      const navigateTo = createNavigate(dispatch, navigation)
      navigateToLink(url, navigation, language, navigateTo, shareUrl)
    },
    [dispatch, navigation]
  )
  return (
    <Dashboard
      {...rest}
      navigateToFeedback={createNavigateToFeedbackModal(navigation)}
      navigateToLink={navigateToLinkProp}
      navigateTo={createNavigate(dispatch, navigation)}
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withPayloadProvider<ContainerPropsType, RefreshPropsType, DashboardRouteType>(refresh)(DashboardContainer))
