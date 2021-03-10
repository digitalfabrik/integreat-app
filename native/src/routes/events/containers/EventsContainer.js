// @flow

import type { EventRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import Events, { type PropsType as EventsPropsType } from '../components/Events'
import { type TFunction, withTranslation } from 'react-i18next'
import type { Dispatch } from 'redux'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { EventModel } from 'api-client'
import * as React from 'react'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import type {
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import type { EventsRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'
import { EVENTS_ROUTE } from 'api-client/src/routes'
import type { ThemeType } from 'build-configs/ThemeType'

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
  events: Array<EventModel>,
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

  const resourceCacheUrl = state.resourceCacheUrl
  if (resourceCacheUrl === null || state.cities.status === 'loading' || switchingLanguage ||
    (route.status === 'loading' && !routeHasOldContent(route)) || languages.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  if (route.status === 'languageNotAvailable') {
    // Necessary for flow type checking, already handled above
    throw new Error('language not available route status not handled!')
  }

  const innerProps = {
    path: route.path,
    events: Array.from(route.models || []),
    cityCode: route.city,
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

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedEvents = withTranslation<$Diff<EventsPropsType, {| theme: ThemeType |}>>('events')(
  withTheme<EventsPropsType>(Events)
)

class EventsContainer extends React.Component<ContainerPropsType> {
  navigateToLinkProp = (url: string, language: string, shareUrl: string) => {
    const { dispatch, navigation } = this.props
    const navigateTo = createNavigate(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateTo, shareUrl)
  }

  render () {
    const { dispatch, navigation, route, ...rest } = this.props
    return <ThemedTranslatedEvents {...rest}
                                   navigateTo={createNavigate(dispatch, navigation)}
                                   navigateToFeedback={createNavigateToFeedbackModal(navigation)}
                                   navigateToLink={this.navigateToLinkProp}
    />
  }
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { route, navigation, cityCode, language, path } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo({
    route: EVENTS_ROUTE,
    cityCode,
    languageCode: language,
    cityContentPath: path || undefined
  },
  route.key,
  true
  )
}

export default withTranslation<OwnPropsType>('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withPayloadProvider<ContainerPropsType, RefreshPropsType, EventsRouteType>(refresh, onRouteClose)(
      EventsContainer
    )))
