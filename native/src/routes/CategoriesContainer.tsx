import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { CATEGORIES_ROUTE, CategoriesRouteType, CityModel, ErrorCode } from 'api-client'

import Categories from '../components/Categories'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withPayloadProvider, { StatusPropsType } from '../hocs/withPayloadProvider'
import useSetShareUrl from '../hooks/useSetShareUrl'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import createNavigate from '../navigation/createNavigate'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { LanguageResourceCacheStateType, StateType } from '../redux/StateType'
import { StoreActionType, SwitchContentLanguageActionType } from '../redux/StoreActionType'
import { reportError } from '../utils/sentry'

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

const createChangeUnavailableLanguage =
  (city: string) => (dispatch: Dispatch<StoreActionType>, newLanguage: string) => {
    const switchContentLanguage: SwitchContentLanguageActionType = {
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        newLanguage,
        city,
      },
    }
    dispatch(switchContentLanguage)
  }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
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
      message: state.cities.message,
      code: state.cities.code,
      refreshProps,
    }
  }
  if (route.status === 'error') {
    return {
      status: 'error',
      message: route.message,
      code: route.code,
      refreshProps,
    }
  }
  if (resourceCache.status === 'error') {
    return {
      status: 'error',
      message: resourceCache.message,
      code: resourceCache.code,
      refreshProps,
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

  const stateView = new CategoriesRouteStateView(route.path, models ?? {}, children ?? {})
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
      resourceCache: resourceCache.value,
      resourceCacheUrl,
    },
  }

  if (route.status === 'loading') {
    return { ...successProps, progress: resourceCache.progress, status: 'loading' }
  }

  return { ...successProps, status: 'success' }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  dispatch,
})

const refresh = async (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { cityCode, language, path, navigation, route } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: CATEGORIES_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path,
    },
    route.key,
    true
  )
}

const CategoriesContainer = ({ dispatch, navigation, route, ...rest }: ContainerPropsType) => {
  const { language, cityModel, stateView } = rest
  const routeInformation = {
    route: CATEGORIES_ROUTE,
    languageCode: language,
    cityCode: cityModel.code,
    cityContentPath: stateView.root().path,
  }
  useSetShareUrl({ navigation, routeInformation, route })

  return (
    <Categories
      {...rest}
      navigateToFeedback={createNavigateToFeedbackModal(navigation)}
      navigateTo={createNavigate(dispatch, navigation)}
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  // @ts-expect-error TODO: IGAPP-636
  withPayloadProvider<ContainerPropsType, RefreshPropsType, CategoriesRouteType>(refresh, true)(CategoriesContainer)
)
