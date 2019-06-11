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
import { branch, renderComponent } from 'recompose'
import EventNotAvailableContainer from './EventLanguageNotAvailableContainer'
import { Failure } from '../../../modules/error/components/Failure'
import withTheme from '../../../modules/theme/hocs/withTheme'

const mapStateToProps = (state: StateType, ownProps) => {
  const {resourceCache, eventsRouteMapping, languages, language, city} = state.cityContent

  if (languages && !languages.map(languageModel => languageModel.code).includes(language)) {
    return {invalidLanguage: true}
  }

  if (eventsRouteMapping.errorMessage !== undefined) {
    return {error: true}
  }

  const route = eventsRouteMapping[ownProps.navigation.getParam('key')]
  if (!route) {
    return {}
  }

  if (!route.allAvailableLanguages.has(route.language || '')) {
    return {invalidLanguage: true}
  }

  return {
    language: route.language,
    cityCode: city,
    cities: state.cities.models,
    events: route.models,
    path: route.path,
    resourceCache: resourceCache
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToEvent: createNavigateToEvent(dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation)
})

export default compose([
  translate('events'),
  connect(mapStateToProps, mapDispatchToProps),
  // TODO NATIVE-112 Show errors
  branch(props => props.error, renderComponent(Failure)),
  branch(props => props.invalidLanguage, renderComponent(EventNotAvailableContainer)),
  withRouteCleaner,
  withTheme(props => props.language)
])(Events)
