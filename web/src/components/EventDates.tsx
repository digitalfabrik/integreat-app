import EventNoteIcon from '@mui/icons-material/EventNote'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RepeatIcon from '@mui/icons-material/Repeat'
import { accordionClasses } from '@mui/material/Accordion'
import { accordionDetailsClasses } from '@mui/material/AccordionDetails'
import { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HORIZONTAL_TEXT_DIVIDER, MAX_FURTHER_DATES, MAX_FURTHER_DATES_MOBILE, MORE_INDICATOR } from 'shared'
import { EventModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import Accordion from './base/Accordion'

const SMALL_ICON_INDENTATION = 3.5

const AccordionWrapper = styled('div')<{ compact: boolean }>(({ theme, compact }) => ({
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
    padding: theme.spacing(0, 0, 0, compact ? SMALL_ICON_INDENTATION : 4),
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
  compact?: boolean
}

const EventDates = ({
  event,
  languageCode,
  filterStartDate = null,
  filterEndDate = null,
  compact = false,
}: EventDatesProps): ReactElement => {
  const [expansionCount, setExpansionCount] = useState(1)
  const { t } = useTranslation()
  const { contentDirection, spacing } = useTheme()
  const { mobile } = useDimensions()

  const date = event.date.firstRecurrenceInRange(filterStartDate, filterEndDate)
  const timeInterval = date.formatTimeInterval(languageCode, { t })

  const maxFurtherDates = compact && mobile ? MAX_FURTHER_DATES_MOBILE : MAX_FURTHER_DATES
  const maxVisibleRecurrences = expansionCount * maxFurtherDates
  const recurrences = date.recurrences(maxVisibleRecurrences + 1).filter(recurrence => !recurrence.isEqual(date))
  const hasRecurrences = date.hasMoreRecurrencesThan(1)
  const hasMoreRecurrences = date.hasMoreRecurrencesThan(maxVisibleRecurrences + 1)

  const extraDateText = date.formatRecurrenceEnd(languageCode, { t }) ?? date.formatWeekdays(languageCode)

  return (
    <>
      <Stack sx={{ flexDirection: 'row', gap: 1 }}>
        <EventNoteIcon fontSize={compact ? 'small' : 'medium'} />
        <TextRow>
          {date.formatDateInterval(languageCode)}
          <>
            <span aria-hidden>{HORIZONTAL_TEXT_DIVIDER}</span>
            {timeInterval}
          </>
        </TextRow>
      </Stack>
      {extraDateText && (
        <TextRow style={{ paddingLeft: spacing(compact ? SMALL_ICON_INDENTATION : 4) }}>{extraDateText}</TextRow>
      )}
      {hasRecurrences && (
        <AccordionWrapper dir={contentDirection} compact={compact}>
          <Accordion
            id={`further-dates-${event.slug}`}
            defaultCollapsed={compact}
            headingComponent='span'
            title={
              <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
                <RepeatIcon color='primary' fontSize='small' />
                <Typography color='primary' variant='body2'>
                  {t($ => $.events.furtherDates)}
                </Typography>
              </Stack>
            }>
            {recurrences.map((recurrence, index) => {
              const recurrenceTimeInterval = recurrence.formatTimeInterval(languageCode, { t })
              return (
                <TextRow key={recurrence.startDate.toISO()}>
                  {recurrence.formatDateInterval(languageCode)}
                  {recurrenceTimeInterval !== timeInterval && (
                    <>
                      <span aria-hidden>{HORIZONTAL_TEXT_DIVIDER}</span>
                      {recurrenceTimeInterval}
                    </>
                  )}
                  {index === recurrences.length - 1 && hasMoreRecurrences && <span>{MORE_INDICATOR}</span>}
                </TextRow>
              )
            })}
            {hasMoreRecurrences && !compact && (
              <Button onClick={() => setExpansionCount(expansionCount + 1)} startIcon={<ExpandMoreIcon />} size='small'>
                <Typography variant='body2' sx={{ textTransform: 'none' }}>
                  {t($ => $.common.showMore)}
                </Typography>
              </Button>
            )}
          </Accordion>
        </AccordionWrapper>
      )}
    </>
  )
}

export default EventDates
