import RepeatIcon from '@mui/icons-material/Repeat'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { MouseEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { MAX_FURTHER_DATES, MAX_FURTHER_DATES_MOBILE } from 'shared'
import { DateModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import Accordion from './base/Accordion'

const AccordionWrapper = styled('div')(({ theme }) => ({
  width: 'fit-content',
  backgroundColor: 'transparent',

  '& .MuiAccordion-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiAccordionSummary-root': {
    minHeight: 40,
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.primary.main,
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(0, 0, 0, 4),
    display: 'flex',
    flexDirection: 'column',
    gap: 4,

    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
    },
  },
}))

const StyledText = styled(Typography)<TypographyProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    ...theme.typography.body2,
  },
}))

const DateEntry = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(1),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: 0,
  },
}))

type EventFurtherDatesProps = {
  date: DateModel
  languageCode: string
}

const EventFurtherDates = ({ date, languageCode }: EventFurtherDatesProps): ReactElement | null => {
  const { t } = useTranslation('events')
  const { contentDirection } = useTheme()
  const { mobile } = useDimensions()

  const maxFurtherDates = mobile ? MAX_FURTHER_DATES_MOBILE : MAX_FURTHER_DATES
  const furtherDates = date.furtherDates(maxFurtherDates)
  if (furtherDates.length === 0) {
    return null
  }

  const formattedRecurrences = furtherDates.map(recurrence => ({
    key: recurrence.startDate.toISO(),
    ...recurrence.formatMonthlyOrYearlyRecurrence(languageCode, t, true),
  }))
  const firstRecurrenceTime = formattedRecurrences[0]?.time
  const hasVaryingTimes = formattedRecurrences.some(recurrence => recurrence.time !== firstRecurrenceTime)
  const showTime = !mobile || hasVaryingTimes

  const stopLinkNavigation = (event: MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <AccordionWrapper dir={contentDirection} onClick={stopLinkNavigation}>
      <Accordion
        id='further-dates'
        defaultCollapsed
        headingComponent='span'
        title={
          <Stack direction='row' alignItems='center' gap={1}>
            <RepeatIcon color='primary' fontSize='small' />
            <StyledText color='primary' variant='body1'>
              {t('furtherDates')}
            </StyledText>
          </Stack>
        }>
        {formattedRecurrences.map(recurrence => (
          <DateEntry key={recurrence.key}>
            <StyledText component='span' variant='body1'>
              {recurrence.date}
            </StyledText>
            {showTime && (
              <StyledText component='span' variant='body1'>
                {recurrence.time}
              </StyledText>
            )}
          </DateEntry>
        ))}
        {date.hasMoreFurtherDates(maxFurtherDates) && (
          <StyledText component='span' variant='body1'>
            …
          </StyledText>
        )}
      </Accordion>
    </AccordionWrapper>
  )
}

export default EventFurtherDates
