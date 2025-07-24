import styled from '@emotion/styled'
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import { DateTime } from 'luxon'
import React, { ReactElement, ElementType } from 'react'
import { useTranslation } from 'react-i18next'

import { getExcerpt, getDisplayDate } from 'shared'
import { DateModel, DateIcon, EventModel } from 'shared/api'

import {
  CalendarTodayRecurringIcon,
  EventThumbnailPlaceholder1,
  EventThumbnailPlaceholder2,
  EventThumbnailPlaceholder3,
} from '../assets'
import { EXCERPT_MAX_CHARS } from '../constants'
import dimensions from '../constants/dimensions'
import ListItem from './ListItem'
import Icon from './base/Icon'
import Tooltip from './base/Tooltip'

const Container = styled.div`
  display: flex;

  @media ${dimensions.smallViewport} {
    flex-direction: column;
  }
`

const CommaContainer = styled.span`
  @media ${dimensions.smallViewport} {
    display: none;
  }
`

const Content = styled.div`
  overflow-wrap: anywhere;
`

type EventListItemProps = {
  event: EventModel
  languageCode: string
  index: number
  filterStartDate?: DateTime | null
  filterEndDate?: DateTime | null
}

const getEventPlaceholder = (path: string): string => {
  const pseudoId = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const placeholders = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return placeholders[pseudoId % placeholders.length]!
}

export const getDateIcon = (date: DateModel): { icon: string | ElementType; tooltip: string } | null => {
  const icons: { [key in DateIcon]: string | ElementType } = {
    CalendarTodayRecurringIcon,
    CalendarRecurringIcon: EventRepeatOutlinedIcon,
    CalendarTodayIcon: TodayOutlinedIcon,
  }
  const iconToUse = date.getDateIcon()
  return iconToUse
    ? {
        icon: icons[iconToUse.icon],
        tooltip: iconToUse.label,
      }
    : null
}

const EventListItem = ({
  event,
  languageCode,
  index,
  filterStartDate = null,
  filterEndDate = null,
}: EventListItemProps): ReactElement => {
  const dateIcon = getDateIcon(event.date)
  const { t } = useTranslation('events')
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)

  const tooltipId = `calendar-icon-${index}`
  const DateIcon = dateIcon && (
    <Tooltip id={tooltipId} tooltipContent={t(dateIcon.tooltip)}>
      <Icon src={dateIcon.icon} id='calendar-icon' title={t(dateIcon.tooltip)} />
    </Tooltip>
  )

  return (
    <ListItem
      thumbnail={event.thumbnail || getEventPlaceholder(event.path)}
      title={event.title}
      path={event.path}
      Icon={DateIcon}>
      <Container>
        <Content dir='auto'>{dateToDisplay.formatEventDateInOneLine(languageCode, t)}</Content>
        {!!event.location && (
          <Content dir='auto'>
            <CommaContainer>, </CommaContainer>
            {event.location.name}
          </Content>
        )}
      </Container>
      <Content dir='auto'>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</Content>
    </ListItem>
  )
}

export default EventListItem
