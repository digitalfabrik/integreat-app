import { EventRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import Events, { PropsType as EventsPropsType } from '../components/Events'
import { withTranslation } from 'react-i18next'
import { Dispatch } from 'redux'
import { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import withPayloadProvider, { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { CityModel, EventModel } from 'api-client'
import * as React from 'react'
import { ErrorCode } from '../../../modules/error/ErrorCodes'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import { EVENTS_ROUTE, EventsRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'

type NavigationPropsType = {
  route: RoutePropType<EventsRouteType>
  navigation: NavigationPropType<EventsRouteType>
}
type OwnPropsType = NavigationPropsType
type DispatchPropsType = {
  dispatch: Dispatch<StoreActionType>
}
type ContainerPropsType = NavigationPropsType &
  DispatchPropsType & {
    path: string | null | undefined
    events: Array<EventModel>
    cityModel: CityModel
    language: string
    resourceCache: LanguageResourceCacheStateType
    resourceCacheUrl: string
  }
type RefreshPropsType = NavigationPropsType & {
  cityCode: string
  language: string
  path: string | null | undefined
}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type PropsType = OwnPropsType & StatePropsType & DispatchPropsType

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

const routeHasOldContent = (route: EventRouteStateType) => 'models' in route && route.allAvailableLanguages

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

  if (!route || route.routeType !== EVENTS_ROUTE) {
    return {
      status: 'routeNotInitialized'
    }
  }

  if (route.status === 'languageNotAvailable' && !switchingLanguage) {
    if (languages.status === 'error' || languages.status === 'loading') {
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
  } else if (resourceCache.status === 'error') {
    return {
      status: 'error',
      message: resourceCache.message,
      code: resourceCache.code,
      refreshProps
    }
  } else if (route.status === 'error') {
    return {
      status: 'error',
      message: route.message,
      code: route.code,
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

  const resourceCacheUrl = state.resourceCacheUrl

  if (
    resourceCacheUrl === null ||
    state.cities.status === 'loading' ||
    switchingLanguage ||
    (route.status === 'loading' && !routeHasOldContent(route)) ||
    languages.status === 'loading'
  ) {
    return {
      status: 'loading',
      progress: 0
    }
  }

  const cities = state.cities.models
  const cityModel = cities.find(city => city.code === route.city)

  if (!cityModel) {
    throw new Error('cityModel is undefined!')
  }

  if (route.status === 'languageNotAvailable') {
    // Necessary for flow type checking, already handled above
    throw new Error('language not available route status not handled!')
  }

  const innerProps = {
    path: route.path,
    events: Array.from(route.models || []),
    cityModel,
    language: route.language,
    resourceCache: resourceCache.value,
    resourceCacheUrl,
    navigation: ownProps.navigation,
    route: ownProps.route
  }

  if (route.status === 'loading') {
    return {
      status: 'loading',
      refreshProps,
      innerProps,
      progress: 0
    }
  }

  return {
    status: 'success',
    refreshProps,
    innerProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  dispatch
})

const ThemedTranslatedEvents = withTranslation('events')(withTheme<EventsPropsType>(Events))

const EventsContainer = ({ dispatch, navigation, route, ...rest }: ContainerPropsType) => {
  const navigateToLinkProp = (url: string, language: string, shareUrl: string) => {
    const navigateTo = createNavigate(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateTo, shareUrl)
  }

  return (
    <ThemedTranslatedEvents
      {...rest}
      navigateTo={createNavigate(dispatch, navigation)}
      navigateToFeedback={createNavigateToFeedbackModal(navigation)}
      navigateToLink={navigateToLinkProp}
    />
  )
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { route, navigation, cityCode, language, path } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: EVENTS_ROUTE,
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
  // @ts-ignore
)(withPayloadProvider<ContainerPropsType, RefreshPropsType, EventsRouteType>(refresh, onRouteClose)(EventsContainer))
