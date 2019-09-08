// @flow

import type { EventRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import connect from 'react-redux/es/connect/connect'
import Events from '../components/Events'
import { translate } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import type { Dispatch } from 'redux'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import type { StatusPropsType } from '../../../modules/error/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/error/hocs/withPayloadProvider'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { CityModel, EventModel } from '@integreat-app/integreat-api-client'
import * as React from 'react'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import omitNavigation from '../../../modules/common/hocs/omitNavigation'

type ContainerPropsType = {|
  path: ?string,
  events: Array<EventModel>,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  navigation: NavigationScreenProp<*>,
  dispatch: Dispatch<StoreActionType>
|}

type RefreshPropsType = {|
  navigation: NavigationScreenProp<*>,
  cityCode: string,
  language: string,
  path: ?string
|}

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const createChangeUnavailableLanguage = (path: ?string, navigation: NavigationScreenProp<*>, city: string) => (
  dispatch: Dispatch<StoreActionType>, newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage, city }
  }
  dispatch(switchContentLanguage)
  const navigateToEvent = createNavigateToEvent(dispatch, navigation)
  navigateToEvent({
    cityCode: city,
    language: newLanguage,
    path,
    forceUpdate: false,
    key: navigation.state.key
  })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, eventsRouteMapping, city, switchingLanguage } = state.cityContent
  const route: ?EventRouteStateType = eventsRouteMapping[ownProps.navigation.state.key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  const refreshProps = { cityCode: city, language: route.language, navigation: ownProps.navigation, path: route.path }
  if (state.cities.status === 'error' ||
    resourceCache.errorMessage !== undefined ||
    route.status === 'error') {
    return { status: 'error', refreshProps }
  }

  if (state.cities.status === 'loading' || switchingLanguage || route.status === 'loading') {
    return { status: 'loading' }
  }

  const cities = state.cities.models
  const languages = Array.from(route.allAvailableLanguages.keys())
  if (!languages.find(language => language === route.language)) {
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages,
      cityCode: city,
      refreshProps,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.path, ownProps.navigation, city)
    }
  }

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      path: route.path,
      events: route.models,
      cities: cities,
      cityCode: city,
      language: route.language,
      resourceCache,
      navigation: ownProps.navigation
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedEvents = translate('events')(
  withTheme(props => props.language)(
    Events
  ))

class EventsContainer extends React.Component<ContainerPropsType> {
  render () {
    const { dispatch, ...rest } = this.props
    return <ThemedTranslatedEvents {...rest}
                                   navigateToEvent={createNavigateToEvent(dispatch, rest.navigation)}
                                   navigateToIntegreatUrl={createNavigateToIntegreatUrl(dispatch, rest.navigation)}
    />
  }
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { navigation, cityCode, language, path } = refreshProps
  const navigateToEvent = createNavigateToEvent(dispatch, navigation)
  navigateToEvent({ cityCode, language, path, forceUpdate: true, key: navigation.state.key })
}

export default withRouteCleaner<PropsType>(
  connect<PropsType, OwnPropsType, StatePropsType, DispatchPropsType, StateType, Dispatch<StoreActionType>>(mapStateToProps, mapDispatchToProps)(
    omitNavigation<PropsType>(
      withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
        EventsContainer
      ))))
