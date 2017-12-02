import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import EventModel from '../../endpoints/models/EventModel'
import Caption from './Caption'

import style from './EventsList.css'

class Event extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(EventModel).isRequired,
    parentUrl: PropTypes.string.isRequired
  }

  getUrl () {
    return `${this.props.parentUrl}/${this.props.event.id}`
  }

  render () {
    return (
      <Link href={this.getUrl()}>
        <div className={style.event}>
          <img className={style.eventThumbnail} src={this.props.event.thumbnail}/>
          <div className={style.eventDescription}>
            <div className={style.eventTitle}>{this.props.event.title}</div>
            <div className={style.eventDate}>{this.props.event.getDate('de')}, {this.props.event.address}</div>
            <div className={style.eventExcerpt}>{this.props.event.excerpt}</div>
          </div>
        </div>
      </Link>
    )
  }
}

class EventList extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (<div>
        <Caption title={'Events'}/>
        { this.props.events
          ? this.props.events.map((event) => <Event key={event.id} event={event} parentUrl={this.props.url}/>)
          : <div>Currently there are no events</div>
        }
      </div>
    )
  }
}

export default EventList
