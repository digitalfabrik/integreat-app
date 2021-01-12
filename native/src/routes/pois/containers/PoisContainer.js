// @flow

import type { PoiRouteStateType, LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import createNavigateToPoi from '../../../modules/app/createNavigateToPoi'
import type { Dispatch } from 'redux'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { CityModel, PoiModel } from 'api-client'
import * as React from 'react'
import createNavigateToInternalLink from '../../../modules/app/createNavigateToInternalLink'
import Pois from '../components/Pois'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import type {
  PoisRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/app/navigateToLink'
import createNavigateToFeedbackModal from '../../../modules/app/createNavigateToFeedbackModal'

type NavigationPropsType = {|
  route: RoutePropType<PoisRouteType>,
  navigation: NavigationPropType<PoisRouteType>
|}

type OwnPropsType = {|
  ...NavigationPropsType,
  t: TFunction
|}

type ContainerPropsType = {|
  ...OwnPropsType,
  path: ?string,
  pois: $ReadOnlyArray<PoiModel>,
  cities: $ReadOnlyArray<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  dispatch: Dispatch<StoreActionType>
|}

type RefreshPropsType = {|
  ...NavigationPropsType,
  cityCode: string,
  language: string,
  path: ?string
|}

type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const onRouteClose = (routeKey: string, dispatch: Dispatch<StoreActionType>) => {
  dispatch({ type: 'CLEAR_POI', params: { key: routeKey } })
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

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, navigation, route: { key } } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }
  const { resourceCache, poisRouteMapping, switchingLanguage, languages } = state.cityContent
  const route: ?PoiRouteStateType = poisRouteMapping[key]
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
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  } else if (resourceCache.status === 'error') {
    return { status: 'error', message: resourceCache.message, code: resourceCache.code, refreshProps }
  } else if (route.status === 'error') {
    return { status: 'error', message: route.message, code: route.code, refreshProps }
  } else if (languages.status === 'error') {
    return { status: 'error', message: languages.message, code: languages.code, refreshProps }
  }

  if (state.resourceCacheUrl === null || state.cities.status === 'loading' || switchingLanguage ||
    route.status === 'loading' || languages.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  if (route.status === 'languageNotAvailable') {
    // Necessary for flow type checking, already handled above
    throw new Error('language not available route status not handled!')
  }

  const cities = state.cities.models

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      path: route.path,
      pois: route.models,
      cities: cities,
      cityCode: route.city,
      language: route.language,
      resourceCache: resourceCache.value,
      resourceCacheUrl: state.resourceCacheUrl,
      navigation,
      route: ownProps.route,
      t: ownProps.t
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedPois = withTranslation('pois')(
  withTheme(Pois)
)

class PoisContainer extends React.Component<ContainerPropsType> {
  navigateToLinkProp = (url: string, language: string, shareUrl: string) => {
    const { dispatch, navigation } = this.props
    const navigateToInternalLink = createNavigateToInternalLink(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateToInternalLink, shareUrl || url)
  }

  render () {
    const { dispatch, ...rest } = this.props
    return <ThemedTranslatedPois {...rest}
                                 navigateToPoi={createNavigateToPoi(dispatch, rest.navigation)}
                                 navigateToFeedback={createNavigateToFeedbackModal(rest.navigation)}
                                 navigateToLink={this.navigateToLinkProp}
    />
  }
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { navigation, route, cityCode, language, path } = refreshProps
  const navigateToPoi = createNavigateToPoi(dispatch, navigation)
  navigateToPoi({ cityCode, language, path, forceRefresh: true, key: route.key })
}

export default withTranslation('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withPayloadProvider<ContainerPropsType, RefreshPropsType, PoisRouteType>(refresh, onRouteClose)(
      PoisContainer
    )))
