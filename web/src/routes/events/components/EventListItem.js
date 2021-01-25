// @flow

import * as React from 'react'
import { EventModel } from 'api-client'
import ListItem from '../../../modules/common/components/ListItem'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

const EXCERPT_LENGTH = 70

type PropsType = {|
  event: EventModel,
  formatter: DateFormatter
|}

const formatExcerpt = (excerpt: string): string => {
  return `${excerpt.slice(0, EXCERPT_LENGTH)}...`
}

/**
 * We have three placeholder thumbnails to display when cities don't provide a thumbnail
 * @returns {*} The Placeholder Thumbnail
 */
const getEventPlaceholder = (path: string): string => {
  const pseudoId = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
  return placeholders[pseudoId % placeholders.length]
}

const EventListItem = ({
  event,
  formatter
}: PropsType) => {
  return (
    <ListItem thumbnail={event.thumbnail || getEventPlaceholder(event.path)}
              title={event.title}
              path={event.path}>
      <div>
        <div>{event.date.toFormattedString(formatter)}</div>
        {event.location.location && <div>{event.location.location}</div>}
      </div>
      <div>{formatExcerpt(event.excerpt)}</div>
    </ListItem>
  )
}

export default EventListItem
