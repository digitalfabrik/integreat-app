// @flow

import type { EventRouteStateType, StateType } from '../../../modules/app/StateType'
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

const mapStateToProps = (state: StateType, route: ?EventRouteStateType) => {
  const {language, city, resourceCache} = state.cityContent
  if (!route || !language) {
    return {
      language,
      cityCode: city,
      resourceCache: resourceCache
    }
  }

  return {
    language: targetRoute.language,
    cityCode: city,
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
  connect((state: StateType, ownProps) => {
    const route = state.cityContent.eventsRouteMapping[ownProps.navigation.getParam('key')]
    if (route && route.error) {
      return {error: true}
    }

    if (route && !route.allAvailableLanguages.has(state.cityContent.language || '')) {
      return {invalidLanguage: true}
    }

    return mapStateToProps(state, route)
  }, mapDispatchToProps),
  // TODO NATIVE-112 Show errors
  branch(props => props.error, renderComponent(Failure)),
  branch(props => props.invalidLanguage, renderComponent(EventNotAvailableContainer)),
  withRouteCleaner
])(Events)
