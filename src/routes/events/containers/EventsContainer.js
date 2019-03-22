// @flow

import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import Events from '../components/Events'
import { translate } from 'react-i18next'
import { CityModel } from '@integreat-app/integreat-api-client'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'

const mapStateToProps = (state: StateType, ownProps) => {
  const {events, language, eventsResourceCache} = state.cityContent
  const targetCity: CityModel = ownProps.navigation.getParam('cityModel')
  const path: string = ownProps.navigation.getParam('path')

  const navigateToEvent = (path: ?string = null) => {
    if (ownProps.navigation.push) {
      const params = {cityModel: targetCity, path: path}
      ownProps.navigation.push('Events', params)
    }
  }

  return {
    language,
    city: targetCity,
    events,
    path,
    navigateToEvent,
    resourceCache: eventsResourceCache
  }
}

export default compose(
  translate('events'),
  connect(mapStateToProps),
  withRouteCleaner
)(Events)
