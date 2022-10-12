import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { CATEGORIES_ROUTE, CityModel, DASHBOARD_ROUTE, DashboardRouteType, ErrorCode } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withPayloadProvider, { StatusProps } from '../hocs/withPayloadProvider'
import useSetShareUrl from '../hooks/useSetShareUrl'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import createNavigate from '../navigation/createNavigate'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { LanguageResourceCacheStateType, StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import { reportError } from '../utils/sentry'
import Dashboard from './Dashboard'

type NavigationProps = {
  route: RoutePropType<DashboardRouteType>
  navigation: NavigationPropType<DashboardRouteType>
}
type OwnProps = NavigationProps
type RefreshProps = NavigationProps & {
  cityCode: string
  language: string
  path: string
}
type ContainerProps = OwnProps & {
  language: string
  cityModel: CityModel
  stateView: CategoriesRouteStateView
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  dispatch: Dispatch<StoreActionType>
}
type StateProps = StatusProps<ContainerProps, RefreshProps>
type DispatchProps = {
  dispatch: Dispatch<StoreActionType>
}

const refresh = (refreshProps: RefreshProps, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, navigation, route, path } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: DASHBOARD_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path,
    },
    route.key,
    true
  )
}

const createChangeUnavailableLanguage =
  (city: string) => (dispatch: Dispatch<StoreActionType>, newLanguage: string) => {
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        newLanguage,
        city,
      },
    })
  }

const mapStateToProps = (state: StateType, ownProps: OwnProps): StateProps => {
  const {
    route: { key },
  } = ownProps

  if (!state.cityContent) {
    return {
      status: 'routeNotInitialized',
    }
  }

  const { resourceCache, routeMapping, switchingLanguage, languages } = state.cityContent
  const route = routeMapping[key]

  if (!route || route.routeType !== CATEGORIES_ROUTE) {
    return {
      status: 'routeNotInitialized',
    }
  }

  if (switchingLanguage) {
    return {
      status: 'loading',
      progress: resourceCache.status === 'ready' ? resourceCache.progress : 0,
    }
  }

  if (route.status === 'languageNotAvailable') {
    if (languages.status === 'error' || languages.status === 'loading') {
      reportError(new Error('languageNotAvailable status impossible if languages not ready'))
      return {
        status: 'error',
        refreshProps: null,
        code: languages.status === 'error' ? languages.code : ErrorCode.UnknownError,
        message: languages.status === 'error' ? languages.message : 'languages not ready',
      }
    }

    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.models.filter(lng => route.allAvailableLanguages.has(lng.code)),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city),
    }
  }

  const refreshProps = {
    cityCode: route.city,
    language: route.language,
    path: route.path,
    navigation: ownProps.navigation,
    route: ownProps.route,
  }

  if (state.cities.status === 'error') {
    return {
      status: 'error',
      refreshProps,
      message: state.cities.message,
      code: state.cities.code,
    }
  }
  if (resourceCache.status === 'error') {
    return {
      status: 'error',
      refreshProps,
      message: resourceCache.message,
      code: resourceCache.code,
    }
  }
  if (route.status === 'error') {
    return {
      status: 'error',
      refreshProps,
      message: route.message,
      code: route.code,
    }
  }
  if (languages.status === 'error') {
    return {
      status: 'error',
      message: languages.message,
      code: languages.code,
      refreshProps,
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
      progress: resourceCache.progress,
    }
  }

  // @ts-expect-error ts does not get that models and children cannot be undefined as it is already checked above
  const stateView = new CategoriesRouteStateView(route.path, models, children)
  const cityModel = state.cities.models.find(city => city.code === route.city)

  if (!cityModel) {
    return {
      status: 'error',
      refreshProps,
      message: 'Unknown city',
      code: ErrorCode.PageNotFound,
    }
  }

  const successProps = {
    refreshProps,
    innerProps: {
      ...ownProps,
      cityModel,
      language: route.language,
      stateView,
      resourceCacheUrl,
      resourceCache: resourceCache.value,
    },
  }

  if (route.status === 'loading') {
    return { ...successProps, progress: resourceCache.progress, status: 'loading' }
  }

  return { ...successProps, status: 'success' }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchProps => ({
  dispatch,
})

const DashboardContainer = ({ dispatch, navigation, ...rest }: ContainerProps) => {
  const { cityModel, language, stateView } = rest
  const routeInformation = {
    route: DASHBOARD_ROUTE,
    languageCode: language,
    cityCode: cityModel.code,
    cityContentPath: stateView.root().path,
  }
  useSetShareUrl({ navigation, routeInformation, route: rest.route })

  return (
    <Dashboard
      {...rest}
      navigateToFeedback={createNavigateToFeedbackModal(navigation)}
      navigateTo={createNavigate(dispatch, navigation)}
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-expect-error TODO: IGAPP-636
)(withPayloadProvider<ContainerProps, RefreshProps, DashboardRouteType>(refresh, false)(DashboardContainer))
