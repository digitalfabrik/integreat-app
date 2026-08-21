import EventNoteIcon from '@mui/icons-material/EventNote'
import RepeatIcon from '@mui/icons-material/Repeat'
import { accordionClasses } from '@mui/material/Accordion'
import { accordionDetailsClasses } from '@mui/material/AccordionDetails'
import { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { MouseEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  firstDateInRange,
  HORIZONTAL_TEXT_DIVIDER,
  MAX_FURTHER_DATES,
  MAX_FURTHER_DATES_MOBILE,
  MORE_INDICATOR,
} from 'shared'
import { EventModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import Accordion from './base/Accordion'

const AccordionWrapper = styled('div')(({ theme }) => ({
  width: 'fit-content',
  backgroundColor: 'transparent',

  [`& .${accordionClasses.root}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${accordionSummaryClasses.root}`]: {
    minHeight: 40,
  },
  [`& .${accordionSummaryClasses.content}`]: {
    margin: 0,
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
    color: theme.palette.primary.main,
  },
  [`& .${accordionDetailsClasses.root}`]: {
    padding: theme.spacing(0, 0, 0, 4),
    display: 'flex',
    flexDirection: 'column',
    gap: 4,

    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
    },
  },
}))

const TextRow = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),

  [theme.breakpoints.down('sm')]: {
    ...theme.typography.body2,
  },
}))

type EventDatesProps = {
  event: EventModel
  languageCode: string
  filterStartDate?: DateTime | null
  filterEndDate?: DateTime | null
  iconSize?: 'small' | 'medium'
}

const EventDates = ({
  event,
  languageCode,
  filterStartDate = null,
  filterEndDate = null,
  iconSize = 'medium',
}: EventDatesProps): ReactElement => {
  const { t } = useTranslation('events')
  const { contentDirection } = useTheme()
  const { desktop } = useDimensions()

  const date = firstDateInRange(event, filterStartDate, filterEndDate)
  const timeInterval = date.formatTimeInterval(languageCode, { allDayLabel: t('places:allDay') })

  const maxFurtherDates = desktop ? MAX_FURTHER_DATES : MAX_FURTHER_DATES_MOBILE
  const furtherDates = event.isRecurring ? date.furtherDates(maxFurtherDates) : []

  const stopLinkNavigation = (mouseEvent: MouseEvent): void => mouseEvent.preventDefault()

  return (
    <>
      <Stack flexDirection='row' gap={1}>
        <EventNoteIcon fontSize={iconSize} />
        <TextRow>
          {date.formatDateInterval(languageCode)}
          <>
            <span aria-hidden>{HORIZONTAL_TEXT_DIVIDER}</span>
            {timeInterval}
          </>
        </TextRow>
      </Stack>
      {furtherDates.length > 0 && (
        <AccordionWrapper dir={contentDirection} onClick={stopLinkNavigation}>
          <Accordion
            id='further-dates'
            defaultCollapsed
            headingComponent='span'
            title={
              <Stack direction='row' alignItems='center' gap={1}>
                <RepeatIcon color='primary' fontSize='small' />
                <TextRow color='primary'>{t('furtherDates')}</TextRow>
              </Stack>
            }>
            {furtherDates.map((furtherDate, index) => (
              <TextRow key={furtherDate.startDate.toISO()}>
                {furtherDate.formatDateInterval(languageCode)}
                {date.hasVaryingTimes() && (
                  <>
                    <span aria-hidden>{HORIZONTAL_TEXT_DIVIDER}</span>
                    {furtherDate.formatTimeInterval(languageCode, { allDayLabel: t('places:allDay') })}
                  </>
                )}
                {index === furtherDates.length - 1 && date.hasMoreFurtherDates(maxFurtherDates) && (
                  <span>{MORE_INDICATOR}</span>
                )}
              </TextRow>
            ))}
          </Accordion>
        </AccordionWrapper>
      )}
    </>
  )
}

export default EventDates
