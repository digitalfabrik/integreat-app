// @flow

import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import connect from 'react-redux/es/connect/connect'
import Events from '../components/Events'
import { translate } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import type { NavigationScreenProp } from 'react-navigation'
import withError from '../../../modules/error/hocs/withError'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { TFunction } from 'react-i18next'
import { EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import type { PropsType as EventPropsType } from '../components/Events'

type OwnPropsType = {| navigation: NavigationScreenProp<*>, t: TFunction |}

type StatePropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  availableLanguages?: Array<LanguageModel>,
  currentCityCode?: string,
  cityCode?: string,
  events?: Array<EventModel>,
  language?: string,
  path?: string,
  resourceCache?: LanguageResourceCacheStateType
|}

type DispatchPropsType = {|
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  changeUnavailableLanguage?: (city: string, newLanguage: string) => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const contentLanguage = state.contentLanguage
  if (!state.cityContent) {
    return { error: false, languageNotAvailable: false }
  }
  const {resourceCache, eventsRouteMapping, city} = state.cityContent

  if (eventsRouteMapping.errorMessage !== undefined || resourceCache.errorMessage !== undefined) {
    return { error: true, languageNotAvailable: false }
  }

  const route = eventsRouteMapping[ownProps.navigation.getParam('key')]

  if (!route) {
    return { error: false, languageNotAvailable: false }
  }

  const languages = Array.from(route.allAvailableLanguages.keys())

  if (!languages.includes(route.language)) {
    return { error: false, languageNotAvailable: true, availableLanguages: languages, currentCityCode: city }
  }

  return {
    error: false,
    languageNotAvailable: false,
    language: route.language,
    cityCode: city,
    events: route.models,
    path: route.path,
    resourceCache
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType): DispatchPropsType => ({
  navigateToEvent: createNavigateToEvent(dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation),
  changeUnavailableLanguage: (city: string, newLanguage: string) => {
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        city,
        newLanguage
      }
    })
  }
})

export default translate('events')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withRouteCleaner(
      withTheme(props => props.language)(
        withError<EventPropsType>(
          Events
        )))))
