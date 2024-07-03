import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import styled from 'styled-components'

import { getExcerpt } from 'shared'
import { DateModel, DateIcon, EventModel } from 'shared/api'

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
import Icon from './base/Icon'

const Content = styled.div`
  overflow-wrap: anywhere;
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

export const getDateIcon = (date: DateModel): { icon: string; tooltip: string } | null => {
  const icons: { [key in DateIcon]: string } = {
    CalendarTodayRecurringIcon,
    CalendarRecurringIcon,
    CalendarTodayIcon,
  }
  const iconToUse = date.getDateIcon()
  return iconToUse
    ? {
        icon: icons[iconToUse.icon],
        tooltip: iconToUse.label,
      }
    : null
}

const EventListItem = ({ event, languageCode }: EventListItemProps): ReactElement => {
  const dateIcon = getDateIcon(event.date)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('events')

  const DateIcon = dateIcon && (
    <>
      <Icon src={dateIcon.icon} id='calendar-icon' title={dateIcon.tooltip} />
      <Tooltip anchorSelect='#calendar-icon'>{t(dateIcon.tooltip)}</Tooltip>
    </>
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
