// @flow

import type { EventRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import Events from '../components/Events'
import { type TFunction, withTranslation } from 'react-i18next'
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
import { mapProps } from 'recompose'

type ContainerPropsType = {|
  path: ?string,
  events: $ReadOnlyArray<EventModel>,
  cities: $ReadOnlyArray<CityModel>,
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

type OwnPropsType = {| navigation: NavigationScreenProp<*>, t: TFunction |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const createChangeUnavailableLanguage = (city: string, t: TFunction) => (
  dispatch: Dispatch<StoreActionType>, newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage, city, t }
  }
  dispatch(switchContentLanguage)
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, navigation } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, eventsRouteMapping, switchingLanguage, languages } = state.cityContent
  const route: ?EventRouteStateType = eventsRouteMapping[navigation.state.key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (state.cities.status === 'loading' || switchingLanguage || route.status === 'loading' ||
    languages.status === 'loading') {
    return { status: 'loading' }
  }

  if (route.status === 'languageNotAvailable') {
    if (languages.status === 'error') {
      console.error('languageNotAvailable status impossible if languages not ready')
      return { status: 'error', refreshProps: null, code: languages.code, message: languages.message }
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
    navigation: ownProps.navigation
  }

  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  } else if (resourceCache.status === 'error') {
    return { status: 'error', message: resourceCache.message, code: resourceCache.code, refreshProps }
  } else if (route.status === 'error') {
    return { status: 'error', message: route.message, code: route.code, refreshProps }
  } else if (languages.status === 'error') {
    return { status: 'error', message: languages.message, code: languages.code, refreshProps }
  }
  const cities = state.cities.models

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      path: route.path,
      events: route.models,
      cities: cities,
      cityCode: route.city,
      language: route.language,
      resourceCache: resourceCache.value,
      navigation
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedEvents = withTranslation('events')(
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
  navigateToEvent({ cityCode, language, path, forceRefresh: true, key: navigation.state.key })
}

type RestType = $Diff<PropsType, OwnPropsType>
const removeOwnProps = (props: PropsType): RestType => {
  const { t, navigation, ...rest } = props
  return rest
}

export default withRouteCleaner<{| navigation: NavigationScreenProp<*> |}>(
  withTranslation('error')(
    connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
      mapProps<RestType, PropsType>(removeOwnProps)(
        withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh)(
          EventsContainer
        )))))
