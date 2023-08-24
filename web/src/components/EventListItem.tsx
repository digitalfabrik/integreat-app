import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { EventModel, getExcerpt } from 'api-client'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../assets'
import { EXCERPT_MAX_CHARS } from '../constants'
import ListItem from './ListItem'

const Content = styled.div`
  overflow-wrap: anywhere;
`

type EventListItemProps = {
  event: EventModel
  languageCode: string
}

/**
 * We have three placeholder thumbnails to display when cities don't provide a thumbnail
 * @returns {*} The Placeholder Thumbnail
 */
const getEventPlaceholder = (path: string): string => {
  const pseudoId = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const placeholders = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return placeholders[pseudoId % placeholders.length]!
}

const EventListItem = ({ event, languageCode }: EventListItemProps): ReactElement => (
  <ListItem thumbnail={event.thumbnail || getEventPlaceholder(event.path)} title={event.title} path={event.path}>
    <Content>
      <Content dir='auto'>{event.date.toFormattedString(languageCode)}</Content>
      {event.location && <Content dir='auto'>{event.location.fullAddress}</Content>}
    </Content>
    <Content dir='auto'>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</Content>
  </ListItem>
)

export default EventListItem
