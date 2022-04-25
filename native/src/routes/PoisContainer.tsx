import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { CityModel, ErrorCode, PoiModel, POIS_ROUTE, PoisRouteType } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withPayloadProvider, { StatusPropsType } from '../hocs/withPayloadProvider'
import createNavigate from '../navigation/createNavigate'
import { LanguageResourceCacheStateType, StateType } from '../redux/StateType'
import { StoreActionType, SwitchContentLanguageActionType } from '../redux/StoreActionType'
import { reportError } from '../utils/sentry'
import Pois from './Pois'

type NavigationPropsType = {
  route: RoutePropType<PoisRouteType>
  navigation: NavigationPropType<PoisRouteType>
}
type OwnPropsType = NavigationPropsType
type ContainerPropsType = OwnPropsType & {
  path: string | null | undefined
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  dispatch: Dispatch<StoreActionType>
}
type RefreshPropsType = NavigationPropsType & {
  cityCode: string
  language: string
  path: string | null | undefined
}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {
  dispatch: Dispatch<StoreActionType>
}

const createChangeUnavailableLanguage =
  (city: string) => (dispatch: Dispatch<StoreActionType>, newLanguage: string) => {
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
    navigation,
    route: { key }
  } = ownProps

  if (!state.cityContent) {
    return {
      status: 'routeNotInitialized'
    }
  }

  const { resourceCache, routeMapping, switchingLanguage, languages } = state.cityContent
  const route = routeMapping[key]

  if (!route || route.routeType !== POIS_ROUTE) {
    return {
      status: 'routeNotInitialized'
    }
  }

  if (route.status === 'languageNotAvailable') {
    if (switchingLanguage) {
      throw new Error('language not available route status not handled!')
    }
    if (languages.status === 'error' || languages.status === 'loading') {
      reportError(new Error('languageNotAvailable status impossible if languages not ready'))
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
    path: route.path,
    cityCode: route.city,
    language: route.language,
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
  }
  if (resourceCache.status === 'error') {
    return {
      status: 'error',
      message: resourceCache.message,
      code: resourceCache.code,
      refreshProps
    }
  }
  if (route.status === 'error') {
    return {
      status: 'error',
      message: route.message,
      code: route.code,
      refreshProps
    }
  }
  if (languages.status === 'error') {
    return {
      status: 'error',
      message: languages.message,
      code: languages.code,
      refreshProps
    }
  }

  const { resourceCacheUrl } = state

  if (
    resourceCacheUrl === null ||
    switchingLanguage ||
    state.cities.status === 'loading' ||
    route.status === 'loading' ||
    languages.status === 'loading'
  ) {
    return {
      status: 'loading',
      progress: resourceCache.progress
    }
  }

  const cityModel = state.cities.models.find(city => city.code === route.city)
  if (!cityModel) {
    return {
      status: 'error',
      refreshProps,
      message: 'Unknown city',
      code: ErrorCode.PageNotFound
    }
  }

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      path: route.path,
      pois: Array.from(route.models),
      cityModel,
      language: route.language,
      resourceCache: resourceCache.value,
      resourceCacheUrl,
      navigation,
      route: ownProps.route
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  dispatch
})

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { navigation, route, cityCode, language, path } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path || undefined
    },
    route.key,
    true
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-expect-error TODO: IGAPP-636
)(withPayloadProvider<ContainerPropsType, RefreshPropsType, PoisRouteType>(refresh, true, true)(Pois))
