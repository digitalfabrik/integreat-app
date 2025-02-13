import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon } from '../assets'
import dimensions from '../constants/dimensions'
import Accordion from './Accordion'
import CustomDatePicker from './DatePicker'
import FilterToggle from './FilterToggle'
import Button from './base/Button'
import Icon from './base/Icon'

const DateSection = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 5px;
  justify-content: space-evenly;

  @media ${dimensions.smallViewport} {
    flex-direction: column;
    align-items: center;
  }
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
`

type ResetFilterTextProps = {
  startDate: DateTime | null
  endDate: DateTime | null
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const text = `${t('resetFilter')} ${startDate ? startDate.toFormat('dd.MM.yyyy') : '∞'} - ${endDate ? endDate.toFormat('dd.MM.yyyy') : '∞'}`
  return <span>{text}</span>
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
}: EventsDateFilterProps): JSX.Element => {
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { t } = useTranslation('events')

  return (
    <>
      <FilterToggle isDateFilterActive={showDateFilter} setToggleDateFilter={setShowDateFilter} />
      <Accordion isOpen={showDateFilter}>
        <DateSection>
          <>
            <CustomDatePicker
              title={t('from')}
              date={startDate}
              setDate={setStartDate}
              error={startDateError ? t(startDateError) : ''}
            />
            <CustomDatePicker title={t('to')} date={endDate} setDate={setEndDate} />
          </>
        </DateSection>
      </Accordion>
      {(startDate || endDate) && (
        <StyledButton
          label='resetDate'
          onClick={() => {
            setStartDate(null)
            setEndDate(null)
          }}>
          <Icon src={CloseIcon} />
          <ResetFilterText startDate={startDate} endDate={endDate} />
        </StyledButton>
      )}
    </>
  )
}
export default EventsDateFilter
