import React, { memo, ReactElement } from 'react'
import styled from 'styled-components/native'

import { DateFormatter, EventModel, parseHTML } from 'api-client'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../assets'
import { EXCERPT_MAX_LINES } from '../constants'
import ListItem from './ListItem'

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

const placeholderThumbnails = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]

type EventListItemProps = {
  event: EventModel
  language: string
  navigateToEvent: () => void
  formatter: DateFormatter
}

const EventListItem = ({ formatter, language, event, navigateToEvent }: EventListItemProps): ReactElement => {
  const thumbnail =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.thumbnail || placeholderThumbnails[event.path.length % placeholderThumbnails.length]!
  const content = parseHTML(event.content)

  return (
    <ListItem thumbnail={thumbnail} title={event.title} language={language} navigateTo={navigateToEvent}>
      <Description>{event.date.toFormattedString(formatter)}</Description>
      <Description numberOfLines={EXCERPT_MAX_LINES}>{content}</Description>
    </ListItem>
  )
}

export default memo(EventListItem)
