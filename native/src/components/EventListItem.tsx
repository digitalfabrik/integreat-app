import * as React from 'react'
import { ReactElement, useCallback, useContext } from 'react'
import styled from 'styled-components/native'

import { EventModel, EVENTS_ROUTE, RouteInformationType, textTruncator } from 'api-client'
import { ThemeType } from 'build-configs'

import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import DateFormatterContext from '../contexts/DateFormatterContext'
import ListItem from './ListItem'

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

const NUM_OF_CHARS_ALLOWED = 90

const getEventPlaceholder = (id: number): number => {
  const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
  return placeholders[id % placeholders.length]!
}

type PropsType = {
  cityCode: string
  event: EventModel
  language: string
  navigateTo: (routeInformation: RouteInformationType) => void
  theme: ThemeType
}

const EventListItem = ({ event, cityCode, language, navigateTo, theme }: PropsType): ReactElement => {
  const formatter = useContext(DateFormatterContext)
  const navigateToEventInCity = useCallback(() => {
    navigateTo({
      route: EVENTS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: event.path,
    })
  }, [navigateTo, cityCode, language, event])
  const thumbnail = event.thumbnail || getEventPlaceholder(event.path.length)
  return (
    <ListItem
      thumbnail={thumbnail}
      title={event.title}
      language={language}
      navigateTo={navigateToEventInCity}
      theme={theme}>
      <Description>{event.date.toFormattedString(formatter)}</Description>
      {event.excerpt && <Description>{textTruncator(event.excerpt, NUM_OF_CHARS_ALLOWED)}</Description>}
    </ListItem>
  )
}

export default EventListItem
