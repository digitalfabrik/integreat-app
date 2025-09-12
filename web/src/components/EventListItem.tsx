import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography, { TypographyProps } from '@mui/material/Typography'
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

const StyledListItem = styled(ListItem)(() => ({
  '& .MuiListItemSecondaryAction-root': {
    top: 32,
  },
}))

const StyledListItemButton = styled(ListItemButton)(() => ({
  alignItems: 'flex-start',
  gap: 16,
})) as typeof ListItemButton

const StyledListItemAvatar = styled(ListItemAvatar)(({ theme }) => ({
  '& .MuiAvatar-root': {
    marginTop: 8,
    width: 96,
    height: 96,
  },

  [theme.breakpoints.down('sm')]: {
    '& .MuiAvatar-root': {
      width: 64,
      height: 64,
    },
  },
}))

const StyledTypography = styled(Typography)<TypographyProps>(() => ({
  '& p': {
    margin: 0,
  },
  '& p:nth-of-type(2)': {
    marginBottom: '4px',
  },
}))

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
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('events')
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)
  const thumbnailSrc = event.thumbnail || getEventPlaceholder(event.path)

  return (
    <StyledListItem
      dir='auto'
      divider
      disablePadding
      secondaryAction={dateIcon && <Tooltip title={t(dateIcon.tooltip)}>{dateIcon.Icon}</Tooltip>}>
      <StyledListItemButton component={Link} to={event.path} dir='auto'>
        <StyledListItemAvatar>
          <Avatar src={thumbnailSrc} alt='' variant='square' />
        </StyledListItemAvatar>
        <ListItemText
          primary={<Typography variant='title2'>{event.title}</Typography>}
          secondary={
            <StyledTypography variant='body1' flexDirection='column' component='div'>
              <p>{dateToDisplay.toFormattedString(languageCode, viewportSmall)}</p>
              {event.location && <p>{event.location.fullAddress}</p>}
              <p>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</p>
            </StyledTypography>
          }
        />
      </StyledListItemButton>
    </StyledListItem>
  )
}

export default EventListItem
