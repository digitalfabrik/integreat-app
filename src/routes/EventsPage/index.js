import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RichLayout from 'components/RichLayout'
import Events from '../../components/Content/Events'
import EventModel from 'endpoints/models/EventModel'
import EVENTS_ENDPOINT from 'endpoints/events'
import withFetcher from '../../endpoints/withFetcher'

class EventsPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired // From withFetcher
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <Events events={this.props.events}/>
      </RichLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    language: state.router.params.language,
    location: state.router.params.location
  }
}

export default connect(mapStateToProps)(withFetcher(EVENTS_ENDPOINT)(EventsPage))
