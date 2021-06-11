import * as React from 'react'
import { ReactElement, useCallback, useContext } from 'react'
import ListItem from './ListItem'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import styled from 'styled-components/native'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { EventModel, EVENTS_ROUTE, RouteInformationType } from 'api-client'
import { ThemeType } from 'build-configs'

type PropsType = {
  cityCode: string
  event: EventModel
  language: string
  navigateTo: (arg0: RouteInformationType) => void
  theme: ThemeType
}
const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

/**
 * We have three placeholder thumbnails to display when cities don't provide a thumbnail
 * @returns {*} The Placeholder Thumbnail
 */
const getEventPlaceholder = (id: number): number => {
  const placeholders = [EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]
  return placeholders[id % placeholders.length]
}

const EventListItem = ({ event, cityCode, language, navigateTo, theme }: PropsType) : ReactElement=> {
  const formatter = useContext(DateFormatterContext)
  const navigateToEventInCity = useCallback(() => {
    navigateTo({
      route: EVENTS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: event.path
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
      <Description theme={theme}>{event.date.toFormattedString(formatter)}</Description>
      {event.location.location && <Description theme={theme}>{event.location.location}</Description>}
    </ListItem>
  )
}

export default EventListItem
