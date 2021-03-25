// @flow

import * as React from 'react'
import { useCallback, useContext } from 'react'
import { EventModel } from 'api-client'
import ListItem from '../../../modules/common/components/ListItem'
import EventPlaceholder1 from '../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../assets/EventPlaceholder3.jpg'
import styled from 'styled-components/native'
import type { ThemeType } from 'build-configs/ThemeType'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'
import { EVENTS_ROUTE } from 'api-client/src/routes'
import type { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import type { StyledComponent } from 'styled-components'

type PropsType = {|
  cityCode: string,
  event: EventModel,
  language: string,
  navigateTo: RouteInformationType => void,
  theme: ThemeType
|}

const Description: StyledComponent<{||}, ThemeType, *> = styled.Text`
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

const EventListItem = ({ event, cityCode, language, navigateTo, theme }: PropsType) => {
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
