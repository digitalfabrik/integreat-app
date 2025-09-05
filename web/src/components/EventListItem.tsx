import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
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
import useWindowDimensions from '../hooks/useWindowDimensions'
import Link from './base/Link'

const TitleRow = styled('div')`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

const Description = styled('div')`
  & [class*='MuiTypography-root'] {
    margin: 0;
  }
`

type EventListItemProps = {
  event: EventModel
  languageCode: string
  filterStartDate?: DateTime | null
  filterEndDate?: DateTime | null
  thumbnailSize?: number
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
  thumbnailSize,
}: EventListItemProps): ReactElement => {
  const dateIcon = getDateIcon(event.date)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('events')
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)
  const thumbnailSrc = event.thumbnail || getEventPlaceholder(event.path)

  return (
    <ListItem dir='auto' component={Link} to={event.path} divider sx={{ display: 'flex', gap: 2 }}>
      {Boolean(thumbnailSrc) && (
        <ListItemAvatar>
          <Avatar
            src={thumbnailSrc}
            alt=''
            variant='square'
            sx={{
              width: thumbnailSize ?? '100px',
              height: thumbnailSize ?? '100px',
            }}
          />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={
          <TitleRow>
            <Typography variant='title2'>{event.title}</Typography>
            {dateIcon && <Tooltip title={t(dateIcon.tooltip)}>{dateIcon.Icon}</Tooltip>}
          </TitleRow>
        }
        secondary={
          <Description dir='auto'>
            <Typography variant='body1'>{dateToDisplay.toFormattedString(languageCode, viewportSmall)}</Typography>
            {event.location && <Typography variant='body1'>{event.location.fullAddress}</Typography>}
            <Typography variant='body1'>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</Typography>
          </Description>
        }
      />
    </ListItem>
  )
}

export default EventListItem
