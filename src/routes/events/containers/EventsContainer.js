// @flow

import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import Events from './Events'
import { translate } from 'react-i18next'
import { CityModel } from '@integreat-app/integreat-api-client'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import getMockedEvents from '../../categories/getMockedEvents'

const mapStateToProps = (state: StateType, ownProps) => {
  const language: string = 'de' // TODO: There is currently no langauge for events in the state
  const targetCity: CityModel = ownProps.navigation.getParam('cityModel')
  const path: string = ownProps.navigation.getParam('path')

  const navigateToEvent = (path: ?string = null) => {
    if (ownProps.navigation.push) {
      const params = {cityModel: targetCity, path: path}
      ownProps.navigation.push('Events', params)
    }
  }
  const fileCache = {} // TODO: There is currently no file cache for events in the state

  const events = getMockedEvents() // Todo: Remove mock

  return {
    language: language,
    city: targetCity,
    events: events,
    path: path,
    navigateToEvent: navigateToEvent,
    files: fileCache.files
  }
}

export default compose(
  translate('events'),
  connect(mapStateToProps),
  withRouteCleaner
)(Events)
