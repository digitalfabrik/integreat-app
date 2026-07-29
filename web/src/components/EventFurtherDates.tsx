import RepeatIcon from '@mui/icons-material/Repeat'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { MouseEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DateModel } from 'shared/api'

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
  },
}))

const StyledText = styled(Typography)(({ theme }) => ({
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
  const { contentDirection } = useTheme()

  const furtherDates = date.furtherDates()
  if (furtherDates.length === 0) {
    return null
  }

  const stopLinkNavigation = (event: MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <AccordionWrapper dir={contentDirection} onClick={stopLinkNavigation}>
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
        {furtherDates.map(recurrence => (
          <StyledText key={recurrence.startDate.toISO()} variant='body1'>
            {recurrence.formatFurtherDate(languageCode, t)}
          </StyledText>
        ))}
        {date.hasMoreFurtherDates() && <StyledText variant='body1'>…</StyledText>}
      </Accordion>
    </AccordionWrapper>
  )
}

export default EventFurtherDates
