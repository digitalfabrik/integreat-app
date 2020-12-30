// @flow

import type { EventRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import Events from '../components/Events'
import { type TFunction, withTranslation } from 'react-i18next'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import type { Dispatch } from 'redux'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { CityModel, EventModel } from 'api-client'
import * as React from 'react'
import createNavigateToInternalLink from '../../../modules/app/createNavigateToInternalLink'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import type {
  EventsRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'

type NavigationPropsType = {|
  route: RoutePropType<EventsRouteType>,
  navigation: NavigationPropType<EventsRouteType>
|}

type OwnPropsType = {|
  ...NavigationPropsType,
  t: TFunction
|}

type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type ContainerPropsType = {|
  ...NavigationPropsType,
  ...DispatchPropsType,
  path: ?string,
  events: ?$ReadOnlyArray<EventModel>,
  cities: $ReadOnlyArray<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string
|}

type RefreshPropsType = {|
  ...NavigationPropsType,
  cityCode: string,
  language: string,
  path: ?string
|}

type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const onRouteClose = (routeKey: string, dispatch: Dispatch<StoreActionType>) => {
  dispatch({ type: 'CLEAR_EVENT', params: { key: routeKey } })
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

const routeHasOldContent = (route: EventRouteStateType) => route.models && route.allAvailableLanguages

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, route: { key } } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, eventsRouteMapping, switchingLanguage, languages } = state.cityContent
  const route: ?EventRouteStateType = eventsRouteMapping[key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (route.status === 'languageNotAvailable' && !switchingLanguage) {
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

  if (state.resourceCacheUrl === null || state.cities.status === 'loading' || switchingLanguage ||
    (route.status === 'loading' && !routeHasOldContent(route)) || languages.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  if (route.status === 'languageNotAvailable') {
    // Necessary for flow type checking, already handled above
    throw new Error('language not available route status not handled!')
  }

  const cities = state.cities.models
  const innerProps = {
    path: route.path,
    events: route.models,
    cities: cities,
    cityCode: route.city,
    language: route.language,
    resourceCache: resourceCache.value,
    resourceCacheUrl: state.resourceCacheUrl,
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

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedEvents = withTranslation('events')(
  withTheme(Events)
)

class EventsContainer extends React.Component<ContainerPropsType> {
  render () {
    const { dispatch, ...rest } = this.props
    return <ThemedTranslatedEvents {...rest}
                                   navigateToEvent={createNavigateToEvent(dispatch, rest.navigation)}
                                   navigateToInternalLink={createNavigateToInternalLink(dispatch, rest.navigation)}
    />
  }
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { route, navigation, cityCode, language, path } = refreshProps
  const navigateToEvent = createNavigateToEvent(dispatch, navigation)
  navigateToEvent({ cityCode, language, cityContentPath: path, forceRefresh: true, key: route.key })
}

export default withTranslation('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withPayloadProvider<ContainerPropsType, RefreshPropsType, EventsRouteType>(refresh, onRouteClose)(
      EventsContainer
    )))
