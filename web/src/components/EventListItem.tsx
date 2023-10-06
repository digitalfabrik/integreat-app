import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { DateModel, EventModel, getExcerpt } from 'api-client'

import {
  CalendarRecurringIcon,
  CalendarTodayIcon,
  CalendarTodayRecurringIcon,
  EventThumbnailPlaceholder1,
  EventThumbnailPlaceholder2,
  EventThumbnailPlaceholder3,
} from '../assets'
import { EXCERPT_MAX_CHARS } from '../constants'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ListItem from './ListItem'
import Tooltip from './Tooltip'
import Icon from './base/Icon'

const Content = styled.div`
  overflow-wrap: anywhere;
`
const StyledTooltip = styled(Tooltip)`
  height: 24px;
`

type EventListItemProps = {
  event: EventModel
  languageCode: string
}

const getEventPlaceholder = (path: string): string => {
  const pseudoId = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const placeholders = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return placeholders[pseudoId % placeholders.length]!
}

const getDateIcon = (date: DateModel): { icon: string; tooltip: string } | null => {
  const isRecurring = date.hasMoreRecurrencesThan(1)
  const isToday = date.isToday

  if (isRecurring && isToday) {
    return { icon: CalendarTodayRecurringIcon, tooltip: 'todayRecurring' }
  }
  if (isRecurring) {
    return { icon: CalendarRecurringIcon, tooltip: 'recurring' }
  }
  if (isToday) {
    return { icon: CalendarTodayIcon, tooltip: 'today' }
  }
  return null
}

const EventListItem = ({ event, languageCode }: EventListItemProps): ReactElement => {
  const dateIcon = getDateIcon(event.date)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('events')

  const DateIcon = dateIcon && (
    <StyledTooltip text={t(dateIcon.tooltip)} flow='up'>
      <Icon src={dateIcon.icon} />
    </StyledTooltip>
  )

  return (
    <ListItem
      thumbnail={event.thumbnail || getEventPlaceholder(event.path)}
      title={event.title}
      path={event.path}
      Icon={DateIcon}>
      <Content>
        <Content dir='auto'>{event.date.toFormattedString(languageCode, viewportSmall)}</Content>
        {event.location && <Content dir='auto'>{event.location.fullAddress}</Content>}
      </Content>
      <Content dir='auto'>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</Content>
    </ListItem>
  )
}

export default EventListItem
