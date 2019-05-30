// @flow

import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import Events from '../components/Events'
import { translate } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import type { NavigationScreenProp } from 'react-navigation'
import withLoading from '../../../modules/common/hocs/withLoading'
import withLanguageNotAvailable from '../../../modules/error/hocs/withLanguageNotAvailable'
import withError from '../../../modules/error/hocs/withError'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  const {resourceCache, eventsRouteMapping, city} = state.cityContent

  if (eventsRouteMapping.errorMessage !== undefined || resourceCache.errorMessage !== undefined) {
    return {error: 'Something went wrong'}
  }

  const route = eventsRouteMapping[ownProps.navigation.getParam('key')]
  if (!route || !city) {
    return {loading: true}
  }

  if (!route.allAvailableLanguages.has(route.language)) {
    return {languageNotAvailable: true, languages: route.allAvailableLanguages, city}
  }

  return {
    language: route.language,
    cityCode: city,
    events: route.models,
    path: route.path,
    resourceCache: resourceCache
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType) => ({
  navigateToEvent: createNavigateToEvent(dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation),
  changeUnavailableLanguage: (city: string, newLanguage: string) => dispatch({
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: {city, newLanguage}
  })
})

export default compose([
  connect(mapStateToProps, mapDispatchToProps),
  withRouteCleaner,
  withError,
  withLanguageNotAvailable,
  withLoading,
  translate('events')
])(Events)
