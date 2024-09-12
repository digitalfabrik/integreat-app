import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon } from '../assets'
import dimensions from '../constants/dimensions'
import DatePicker from './DatePicker'
import FilterToggle from './FilterToggle'
import Button from './base/Button'
import Icon from './base/Icon'

const DateSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 0 5px 15px;
  justify-content: center;

  @media ${dimensions.smallViewport} {
    flex-direction: column;
    align-items: center;
  }
`

const StyledButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
`

type ResetFilterTextProps = {
  startDate: DateTime
  endDate: DateTime
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const title = `${t('resetFilter')} ${startDate.toLocaleString()} - ${endDate.toLocaleString()}`
  return <span>{title}</span>
}
type EventsDateFilterProps = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  startDateError: string | null
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
  endDateError: string | null
}
const EventsDateFilter = ({
  startDate,
  setStartDate,
  startDateError,
  endDate,
  setEndDate,
  endDateError,
}: EventsDateFilterProps): JSX.Element => {
  const defaultStartDate = DateTime.now().startOf('day')
  const defaultEndDate = DateTime.now().plus({ year: 1 }).startOf('day')
  const [showDateFilter, setShowDateFilter] = useState(true)
  const isReset = startDate?.startOf('day').equals(defaultStartDate) && endDate?.startOf('day').equals(defaultEndDate)
  const { t } = useTranslation('events')
  return (
    <>
      <DateSection>
        <FilterToggle toggle={showDateFilter} setToggleDateFilter={setShowDateFilter} />
        {showDateFilter && (
          <>
            <DatePicker title={t('from')} date={startDate} setDate={setStartDate} error={t(startDateError ?? '')} />
            <DatePicker title={t('to')} date={endDate} setDate={setEndDate} error={t(endDateError ?? '')} />
          </>
        )}
      </DateSection>
      {!isReset && showDateFilter && (
        <StyledButton
          label='resetDate'
          onClick={() => {
            setStartDate(defaultStartDate)
            setEndDate(defaultEndDate)
          }}>
          <Icon src={CloseIcon} />
          <ResetFilterText startDate={startDate ?? defaultStartDate} endDate={endDate ?? defaultEndDate} />
        </StyledButton>
      )}
    </>
  )
}
export default EventsDateFilter
