import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { DateFormatter, EventModel, getExcerpt } from 'api-client'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import { EXCERPT_MAX_CHARS } from '../constants'
import ListItem from './ListItem'

const Content = styled.div`
  overflow-wrap: anywhere;
`

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
    <Content>
      <Content dir='auto'>{event.date.toFormattedString(formatter)}</Content>
      {event.location && <Content dir='auto'>{event.location.fullAddress}</Content>}
    </Content>
    <Content dir='auto'>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</Content>
  </ListItem>
)

export default EventListItem
