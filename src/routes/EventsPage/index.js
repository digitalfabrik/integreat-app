import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import RichLayout from 'components/RichLayout'
import { EventsFetcher } from 'endpoints'

class PageAdapter extends React.Component {
  render () {
    return <div>
      { this.props.events.map(event => (
        <div key={event.id}>
          <Row>
            <Col sm={8}>
              <h2>{event.title}</h2>
              <h3>{event.date.toString()}</h3>
              <h3>{`${event.town} ${event.address}`}</h3>
            </Col>
            <Col sm={4}>
              <img src={event.thumbnail} />
            </Col>
          </Row>
          <div dangerouslySetInnerHTML={{__html: event.content}} />
        </div>))
      }
    </div>
  }
}

class EventsPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <EventsFetcher>
          <PageAdapter/>
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
