// @flow

import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import Events from '../components/Events'
import { translate } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

const mapStateToProps = (state: StateType, ownProps) => {
  const {language, city, eventsResourceCache} = state.cityContent
  const key: string = ownProps.navigation.getParam('key')

  const targetRoute = state.cityContent.eventsRouteMapping[key]

  if (!targetRoute || !language) {
    return {
      language,
      city,
      resourceCache: eventsResourceCache
    }
  }

  return {
    language,
    city,
    events: targetRoute.models,
    path: targetRoute.path,
    resourceCache: eventsResourceCache
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToEvent: createNavigateToEvent(dispatch, ownProps.navigation)
})

export default compose(
  translate('events'),
  connect(mapStateToProps, mapDispatchToProps),
  withRouteCleaner
)(Events)
