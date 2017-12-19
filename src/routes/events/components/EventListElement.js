import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import cx from 'classnames'

import EventModel from '../../../modules/endpoint/models/EventModel'

import style from './EventListElement.css'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import RemoteContent from 'modules/common/components/RemoteContent'

class EventListElement extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(EventModel).isRequired,
    parentUrl: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    isFirst: PropTypes.bool.isRequired
  }

  getUrl () {
    return `${this.props.parentUrl}/${this.props.event.id}`
  }

  getEventPlaceholder () {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % 3]
  }

  render () {
    return (
      <Link href={this.getUrl()} className={this.props.isFirst ? cx(style.firstEvent, style.event) : style.event}>
        <img className={style.eventThumbnail} src={this.props.event.thumbnail || this.getEventPlaceholder()}/>
        <div className={style.eventDescription}>
          <div className={style.eventTitle}>{this.props.event.title}</div>
          <div className={style.eventDate}>{this.props.event.getDate(this.props.language)}, {this.props.event.address}</div>
          <RemoteContent dangerouslySetInnerHTML={{__html: this.formatExcerpt()}}/>
        </div>
      </Link>
    )
  }

  formatExcerpt () {
    return this.props.event.excerpt.slice(0, 70) + '...'
  }
}

export default EventListElement
