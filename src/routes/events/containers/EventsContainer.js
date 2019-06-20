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
import withError from '../../../modules/error/hocs/withError'
import withTheme from '../../../modules/theme/hocs/withTheme'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  const {resourceCache, eventsRouteMapping, city} = state.cityContent

  if (eventsRouteMapping.errorMessage !== undefined || state.cities.errorMessage !== undefined ||
    resourceCache.errorMessage !== undefined) {
    return {error: true}
  }

  const cities = state.cities.models

  const route = eventsRouteMapping[ownProps.navigation.getParam('key')]
  if (!route || !city) {
    return {}
  }

  if (!route.allAvailableLanguages.has(route.language)) {
    return {languageNotAvailable: true, languages: route.allAvailableLanguages, city}
  }

  return {
    language: route.language,
    cityCode: city,
    cities,
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
  translate('events'),
  withTheme(props => props.language)
])(Events)
