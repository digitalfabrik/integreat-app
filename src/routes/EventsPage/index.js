import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RichLayout from 'components/RichLayout'
import Events from '../../components/Content/Events'
import EventModel from 'endpoints/models/EventModel'
import EVENTS_ENDPOINT from 'endpoints/events'
import withFetcher from '../../endpoints/withFetcher'

class ContentWrapper extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired // From withFetcher
  }

  render () {
    return <Events events={this.props.events}/>
  }
}

const FetchingContentWrapper = withFetcher(EVENTS_ENDPOINT)(ContentWrapper)

class EventsPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <FetchingContentWrapper/>
      </RichLayout>
    )
  }
}

function mapStateToProps (state) {
  return {location: state.router.params.location}
}

export default connect(mapStateToProps)(EventsPage)
