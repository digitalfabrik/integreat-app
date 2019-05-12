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
import EventNotAvailableContainer from './EventNotAvailableContainer'

const mapStateToProps = (state: StateType, ownProps) => {
  const {language, city, resourceCache} = state.cityContent
  const key: string = ownProps.navigation.getParam('key')

  const targetRoute = state.cityContent.eventsRouteMapping[key]

  if (!targetRoute || !language) {
    return {
      language,
      cityCode: city,
      resourceCache: resourceCache
    }
  }

  return {
    language,
    cityCode: city,
    events: targetRoute.models,
    path: targetRoute.path,
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
    return {invalidLanguage: route && !route.allAvailableLanguages.has(state.cityContent.language || '')}
  }),
  branch(props => props.invalidLanguage, renderComponent(EventNotAvailableContainer)),
  connect(mapStateToProps, mapDispatchToProps),
  withRouteCleaner
])(Events)
