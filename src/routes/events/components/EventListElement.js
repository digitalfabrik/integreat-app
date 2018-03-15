// @flow

import React from 'react'

import style from './EventListElement.css'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import RemoteContent from 'modules/common/components/RemoteContent'
import TimeSpan from './TimeSpan'
import Link from 'redux-first-router-link'
import EventModel from '../../../modules/endpoint/models/EventModel'
import { goToEvents } from '../../../modules/app/routes/events'

const EXCERPT_LENGTH = 70

type Props = {
  event: EventModel,
  city: string,
  language: string
}

/**
 * Display a element of the EventList
 */
class EventListElement extends React.Component<Props> {
  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */
  getEventPlaceholder () {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % placeholders.length]
  }

  render () {
    const {city, language, event} = this.props
    return (
      <Link to={goToEvents(city, language, event.id)} className={style.event}>
        <img className={style.eventThumbnail} src={event.thumbnail || this.getEventPlaceholder()} />
        <div className={style.eventDescription}>
          <div className={style.eventTitle}>{event.title}</div>
          <div className={style.eventDate}>
            <TimeSpan startDate={event.startDate}
                      endDate={event.endDate}
                      allDay={event.allDay}
                      locale={this.props.language} />
            , {event.address}
          </div>
          <RemoteContent dangerouslySetInnerHTML={{__html: this.formatExcerpt(EXCERPT_LENGTH)}} />
        </div>
      </Link>
    )
  }

  /**
   * Formats the excerpt to a given length
   * @param excerptLength The maximal length of the excerpt
   * @returns {string} The formatted excerpt
   */
  formatExcerpt (excerptLength: number): string {
    return `${this.props.event.excerpt.slice(0, excerptLength)}...`
  }
}

export default EventListElement
