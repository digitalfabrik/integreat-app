import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDatePicker from './DatePicker'
import FilterToggle from './FilterToggle'
import Button from './base/Button'
import Icon from './base/Icon'

const DateSection = styled('div')`
  display: flex;
  gap: 10px;
  justify-content: space-evenly;

  ${props => props.theme.breakpoints.down('md')} {
    flex-direction: column;
    align-items: center;
  }
`

const Text = styled('span')`
  color: ${props => props.theme.legacy.colors.textColor};
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
`

const StyledAccordion = styled(Accordion)`
  background-color: transparent;
`

type ResetFilterTextProps = {
  startDate: DateTime | null
  endDate: DateTime | null
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const text = `${t('resetFilter')} ${startDate ? startDate.toFormat('dd.MM.yyyy') : '∞'} - ${endDate ? endDate.toFormat('dd.MM.yyyy') : '∞'}`
  return <Text>{text}</Text>
}

type EventsDateFilterProps = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  startDateError: string | null
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
}

const EventsDateFilter = ({
  startDate,
  setStartDate,
  startDateError,
  endDate,
  setEndDate,
}: EventsDateFilterProps): ReactElement => {
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { t } = useTranslation('events')

  const today = DateTime.now()
  const inAWeek = DateTime.now().plus({ week: 1 })

  return (
    <>
      <StyledAccordion disableGutters expanded={showDateFilter} elevation={0}>
        <FilterToggle isDateFilterActive={showDateFilter} setToggleDateFilter={setShowDateFilter} />
        <AccordionDetails>
          <DateSection>
            <CustomDatePicker
              title={t('from')}
              date={startDate}
              setDate={setStartDate}
              error={startDateError ? t(startDateError) : undefined}
              placeholderDate={today}
              calendarLabel={t('selectStartDateCalendar')}
            />
            <CustomDatePicker
              title={t('to')}
              date={endDate}
              setDate={setEndDate}
              placeholderDate={inAWeek}
              calendarLabel={t('selectEndDateCalendar')}
            />
          </DateSection>
        </AccordionDetails>
      </StyledAccordion>
      {(startDate || endDate) && (
        <StyledButton
          label='resetDate'
          onClick={() => {
            setStartDate(null)
            setEndDate(null)
          }}>
          <Icon src={CloseOutlinedIcon} />
          <ResetFilterText startDate={startDate} endDate={endDate} />
        </StyledButton>
      )}
    </>
  )
}
export default EventsDateFilter
