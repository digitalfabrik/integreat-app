import React, { JSXElementConstructor, memo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { DateModel, EventModel, parseHTML } from 'api-client'

import {
  CalendarRecurringIcon,
  CalendarTodayIcon,
  CalendarTodayRecurringIcon,
  EventThumbnailPlaceholder1,
  EventThumbnailPlaceholder2,
  EventThumbnailPlaceholder3,
} from '../assets'
import { EXCERPT_MAX_LINES } from '../constants'
import ListItem from './ListItem'
import Icon from './base/Icon'

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

const placeholderThumbnails = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]

const getDateIcon = (date: DateModel): { icon: JSXElementConstructor<SvgProps>; label: string } | null => {
  const isRecurring = date.hasMoreRecurrencesThan(1)
  const isToday = date.isToday

  if (isRecurring && isToday) {
    return { icon: CalendarTodayRecurringIcon, label: 'todayRecurring' }
  }
  if (isRecurring) {
    return { icon: CalendarRecurringIcon, label: 'recurring' }
  }
  if (isToday) {
    return { icon: CalendarTodayIcon, label: 'today' }
  }
  return null
}

type EventListItemProps = {
  event: EventModel
  language: string
  navigateToEvent: () => void
}

const EventListItem = ({ language, event, navigateToEvent }: EventListItemProps): ReactElement => {
  const thumbnail =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.thumbnail || placeholderThumbnails[event.path.length % placeholderThumbnails.length]!
  const content = parseHTML(event.content).trim()
  const icon = getDateIcon(event.date)
  const { t } = useTranslation('events')

  const DateIcon = icon ? <Icon Icon={icon.icon} label={t(icon.label)} /> : null

  return (
    <ListItem
      thumbnail={thumbnail}
      title={event.title}
      language={language}
      navigateTo={navigateToEvent}
      Icon={DateIcon}>
      <Description>{event.date.toFormattedString(language, 'D')}</Description>
      <Description numberOfLines={EXCERPT_MAX_LINES}>{content}</Description>
    </ListItem>
  )
}

export default memo(EventListItem)
