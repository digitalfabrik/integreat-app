import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import SVG from 'react-inlinesvg'

import { getDisplayDate, getExcerpt } from 'shared'
import { DateIcon, DateModel, EventModel } from 'shared/api'

import {
  CalendarTodayRecurringIcon,
  EventThumbnailPlaceholder1,
  EventThumbnailPlaceholder2,
  EventThumbnailPlaceholder3,
} from '../assets'
import { EXCERPT_MAX_CHARS } from '../constants'
import ListItem from './ListItem'

const Container = styled('div')`
  display: flex;

  ${props => props.theme.breakpoints.down('md')} {
    flex-direction: column;
  }
`

const CommaContainer = styled('span')`
  ${props => props.theme.breakpoints.down('md')} {
    display: none;
  }
`

const Content = styled('div')`
  overflow-wrap: anywhere;
`

type EventListItemProps = {
  event: EventModel
  languageCode: string
  filterStartDate?: DateTime | null
  filterEndDate?: DateTime | null
}

const getEventPlaceholder = (path: string): string => {
  const pseudoId = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const placeholders = [EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return placeholders[pseudoId % placeholders.length]!
}

export const getDateIcon = (date: DateModel): { Icon: ReactElement; tooltip: string } | null => {
  const icons: { [key in DateIcon]: ReactElement } = {
    CalendarTodayRecurringIcon: <SVG src={CalendarTodayRecurringIcon} />,
    CalendarRecurringIcon: <EventRepeatOutlinedIcon />,
    CalendarTodayIcon: <TodayOutlinedIcon />,
  }
  const iconToUse = date.getDateIcon()
  return iconToUse
    ? {
        Icon: icons[iconToUse.icon],
        tooltip: iconToUse.label,
      }
    : null
}

const EventListItem = ({
  event,
  languageCode,
  filterStartDate = null,
  filterEndDate = null,
}: EventListItemProps): ReactElement => {
  const dateIcon = getDateIcon(event.date)
  const { t } = useTranslation('events')
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)

  return (
    <ListItem
      thumbnail={event.thumbnail || getEventPlaceholder(event.path)}
      title={event.title}
      path={event.path}
      Icon={dateIcon && <Tooltip title={t(dateIcon.tooltip)}>{dateIcon.Icon}</Tooltip>}>
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
