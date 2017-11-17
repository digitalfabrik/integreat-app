import React from 'react'
import PropTypes from 'prop-types'

import Events from '../../components/Content/Events'
import EventModel from 'endpoints/models/EventModel'
import EVENTS_ENDPOINT from 'endpoints/events'
import withFetcher from 'endpoints/withFetcher'
import withAvailableLanguageUpdater from 'hocs/withAvailableLanguageUpdater'
import compose from 'redux/es/compose'

class EventsPage extends React.Component {
  static propTypes = {
    /**
     * from withFetcher HOC which provides data from EVENTS_ENDPOINT
     */
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired
  }

  render () {
    return <Events events={this.props.events}/>
  }
}

export default compose(
  withFetcher(EVENTS_ENDPOINT),
  withAvailableLanguageUpdater((location, language) => `/${location}/${language}/events`)
)(EventsPage)
