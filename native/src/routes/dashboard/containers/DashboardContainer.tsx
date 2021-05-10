import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { PropsType as DashboardPropsType } from '../components/Dashboard'
import Dashboard from '../components/Dashboard'
import { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import { StoreActionType } from '../../../modules/app/StoreActionType'
import { withTranslation } from 'react-i18next'
import { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import { CATEGORIES_ROUTE, CityModel } from 'api-client'
import React, { useCallback } from 'react'
import { ErrorCode } from '../../../modules/error/ErrorCodes'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import { DASHBOARD_ROUTE } from 'api-client/src/routes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import { DashboardRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'

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
type PropsType = OwnPropsType & StatePropsType & DispatchPropsType

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
      progress: resourceCache.progress ? resourceCache.progress : 0
    }
  }

  if (route.status === 'languageNotAvailable') {
    if (languages.status === 'error' || languages.status === 'loading') {
      console.error('languageNotAvailable status impossible if languages not ready')
      return {
        status: 'error',
        refreshProps: null,
        code: languages.code || ErrorCode.UnknownError,
        message: languages.message || 'languages not ready'
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

  // $FlowFixMe Flow does not get that models and children cannot be undefined as it is already checked above
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

const ThemedTranslatedDashboard = withTranslation('dashboard')(withTheme<DashboardPropsType>(Dashboard))

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
    <ThemedTranslatedDashboard
      {...rest}
      navigateToFeedback={createNavigateToFeedbackModal(navigation)}
      navigateToLink={navigateToLinkProp}
      navigateTo={createNavigate(dispatch, navigation)}
    />
  )
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(withPayloadProvider<ContainerPropsType, RefreshPropsType, DashboardRouteType>(refresh)(DashboardContainer))
