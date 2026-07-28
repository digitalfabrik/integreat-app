import RepeatIcon from '@mui/icons-material/Repeat'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { MouseEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DateModel } from 'shared/api'

import Accordion from './base/Accordion'

const MAX_FURTHER_DATES = 6

const AccordionWrapper = styled('div')(({ theme }) => ({
  width: 'fit-content',
  backgroundColor: 'transparent',

  '& .MuiAccordion-root': {
    backgroundColor: 'transparent',
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
  },
}))

const StyledText = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('sm')]: {
    ...theme.typography.body2,
  },
}))

type EventFurtherDatesProps = {
  date: DateModel
  languageCode: string
}

const EventFurtherDates = ({ date, languageCode }: EventFurtherDatesProps): ReactElement | null => {
  const { t } = useTranslation('events')

  const furtherDates = date.isMonthlyOrYearlyRecurrence() ? date.recurrences(MAX_FURTHER_DATES).slice(1) : []
  if (furtherDates.length === 0) {
    return null
  }
  const hasMoreDates = date.hasMoreRecurrencesThan(MAX_FURTHER_DATES)

  const formatFurtherDate = (recurrence: DateModel): string => {
    const { date: formattedDate, time } = recurrence.formatMonthlyOrYearlyRecurrence(languageCode, t, true)
    return `${formattedDate} · ${time}`
  }

  const stopLinkNavigation = (event: MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <AccordionWrapper onClick={stopLinkNavigation}>
      <Accordion
        id='further-dates'
        defaultCollapsed
        title={
          <Stack direction='row' alignItems='center' gap={1}>
            <RepeatIcon color='primary' fontSize='small' />
            <StyledText color='primary' variant='body1'>
              {t('furtherDates')}
            </StyledText>
          </Stack>
        }>
        {furtherDates.map((recurrence, index) => {
          const isLast = index === furtherDates.length - 1
          const formattedDate = formatFurtherDate(recurrence)
          return (
            <StyledText key={recurrence.startDate.toISO()} variant='body1'>
              {isLast && hasMoreDates ? `${formattedDate} …` : formattedDate}
            </StyledText>
          )
        })}
      </Accordion>
    </AccordionWrapper>
  )
}

export default EventFurtherDates
