import React, { ReactElement } from 'react'

import { DateFormatter, EventModel } from 'api-client'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import { textTruncator } from '../utils/stringUtils'
import ListItem from './ListItem'

export const NUM_OF_CHARS_ALLOWED = 110

type PropsType = {
  event: EventModel
  formatter: DateFormatter
}

/**
 * We have three placeholder thumbnails to display when cities don't provide a thumbnail
 * @returns {*} The Placeholder Thumbnail
 */
const getEventPlaceholder = (path: string): string => {
  const pseudoId = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
  return placeholders[pseudoId % placeholders.length]!
}

const EventListItem = ({ event, formatter }: PropsType): ReactElement => (
  <ListItem thumbnail={event.thumbnail || getEventPlaceholder(event.path)} title={event.title} path={event.path}>
    <div>
      <div>{event.date.toFormattedString(formatter)}</div>
      {event.location && <div>{event.location.fullAddress}</div>}
    </div>
    <div>{textTruncator(event.excerpt, NUM_OF_CHARS_ALLOWED)}</div>
  </ListItem>
)

export default EventListItem
