import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getDisplayDate, getExcerpt } from 'shared'
import { EventModel } from 'shared/api'

import { EventThumbnailPlaceholder1, EventThumbnailPlaceholder2, EventThumbnailPlaceholder3 } from '../assets'
import { EXCERPT_MAX_CHARS } from '../constants'
import Link from './base/Link'

const StyledListItem = styled(ListItem)`
  [class*='MuiListItemSecondaryAction-root'] {
    top: 32px;
  }
`

const StyledListItemButton = styled(ListItemButton)`
  align-items: flex-start;
  gap: ${props => props.theme.spacing(2)};
` as typeof ListItemButton

export const Icon = styled('img')(({ theme }) => ({
  marginTop: 8,
  width: 96,
  height: 96,
  objectFit: 'contain',

  [theme.breakpoints.down('sm')]: {
    width: 64,
    height: 64,
  },
}))

const StyledTypography = styled(Typography)<TypographyProps>`
  p {
    margin: 0;
  }

  p:nth-of-type(2) {
    margin-bottom: 4px;
  }
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

const EventListItem = ({
  event,
  languageCode,
  filterStartDate = null,
  filterEndDate = null,
}: EventListItemProps): ReactElement => {
  const { t } = useTranslation('events')
  const recurringDateIcon = event.isRecurring ? (
    <Tooltip title={t('recurring')}>
      <EventRepeatOutlinedIcon />
    </Tooltip>
  ) : undefined
  const dateToDisplay = getDisplayDate(event, filterStartDate, filterEndDate)
  const thumbnailSrc = event.thumbnail || getEventPlaceholder(event.path)

  return (
    <StyledListItem dir='auto' disablePadding secondaryAction={recurringDateIcon}>
      <StyledListItemButton component={Link} to={event.path}>
        <ListItemIcon>
          <Icon src={thumbnailSrc} alt='' />
        </ListItemIcon>
        <ListItemText
          disableTypography
          primary={
            <Typography component='h3' variant='subtitle1'>
              {event.title}
            </Typography>
          }
          secondary={
            <StyledTypography variant='body1' flexDirection='column' component='div'>
              <p>{dateToDisplay.formatEventDateInOneLine(languageCode, t)}</p>
              {event.location && <p>{event.location.name}</p>}
              <p>{getExcerpt(event.excerpt, { maxChars: EXCERPT_MAX_CHARS })}</p>
            </StyledTypography>
          }
        />
      </StyledListItemButton>
    </StyledListItem>
  )
}

export default EventListItem
