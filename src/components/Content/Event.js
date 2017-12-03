import React from 'react'
import PropTypes from 'prop-types'

import EventModel from '../../endpoints/models/EventModel'
import RemoteContent from './RemoteContent'

import style from './Event.css'

class Event extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(EventModel).isRequired
  }

  render () {
    return (
      <div>
        <img className={style.eventThumbnail} src={this.props.event.thumbnail}/>
        <div className={style.eventTitle}>{this.props.event.title}</div>
        <div className={style.eventDateAdress}>{this.props.event.getDate('de')}, {this.props.event.address}</div>
        <RemoteContent dangerouslySetInnerHTML={{__html: this.props.event.content}}/>
      </div>
    )
  }
}

export default Event
