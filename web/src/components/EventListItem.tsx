import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { DateFormatter, EventModel, getExcerpt } from 'api-client'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import { EXCERPT_MAX_CHARS } from '../constants'
import ListItem from './ListItem'
import TextButton from './TextButton'
import { mapToICalFormat } from 'api-client/src/utils/eventExport'

const Content = styled.div`
  overflow-wrap: anywhere;
`

type EventListItemProps = {
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

// TODO how link the download with triggering of calendar import?
const downloadEventAsIcsFile = (event: EventModel) => {
  const blob = new Blob([mapToICalFormat(event)], { type: 'text/calendar;charset=utf-8' })
  const linkEl = document.createElement('a')
  linkEl.href = window.URL.createObjectURL(blob)
  // TODO check if it is ok to use the same file name foreach event. What happens if the user uses another browser to export an event?
  linkEl.setAttribute('download', 'event.ics')
  document.body.appendChild(linkEl)
  linkEl.click()
  document.body.removeChild(linkEl)

}

const EventListItem = ({ event, formatter }: EventListItemProps): ReactElement => (
  <ListItem thumbnail={event.thumbnail || getEventPlaceholder(event.path)} title={event.title} path={event.path}>
    <Content>
      <Content dir='auto'>{event.date.toFormattedString(formatter)}</Content>
      {event.location && <Content dir='auto'>{event.location.fullAddress}</Content>}
    </Content>
    <Content dir='auto'>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</Content>
    <TextButton onClick={() => downloadEventAsIcsFile(event)} text={'export'} />
  </ListItem>
)


export default EventListItem
