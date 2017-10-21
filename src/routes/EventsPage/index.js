import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RichLayout from 'components/RichLayout'
import { EventsFetcher } from 'endpoints'
import Events from '../../components/Content/Events'

class EventsPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <EventsFetcher>
          <Events />
        </EventsFetcher>
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

export default connect(mapStateToProps)(EventsPage)
