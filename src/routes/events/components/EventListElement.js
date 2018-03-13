// @flow

import React from 'react'
import { Link } from 'redux-little-router'

import style from './EventListElement.css'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import RemoteContent from 'modules/common/components/RemoteContent'
import TimeSpan from './TimeSpan'
import EventModel from '../../../modules/endpoint/models/EventModel'

const EXCERPT_LENGTH = 70

type Props = {
  event: EventModel,
  parentUrl: string,
  language: string
}

/**
 * Display a element of the EventList
 */
class EventListElement extends React.Component<Props> {
  /**
   * Generates the url of the specific event represented by this EventListElement
   * @returns {string} The url
   */
  getUrl (): string {
    return `${this.props.parentUrl}/${this.props.event.id}`
  }

  /**
   * We have three placeholder thumbnails to display when cities don't provide a thumbnail
   * @returns {*} The Placeholder Thumbnail
   */
  getEventPlaceholder () {
    const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
    return placeholders[this.props.event.id % placeholders.length]
  }

  render () {
    const event = this.props.event
    return (
      <Link href={this.getUrl()} className={style.event}>
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
