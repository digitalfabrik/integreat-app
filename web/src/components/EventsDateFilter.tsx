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
  fromDate: DateTime
  toDate: DateTime
}

const ResetFilterText = ({ fromDate, toDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const title = `${t('resetFilter')} ${fromDate.toLocaleString()} - ${toDate.toLocaleString()}`
  return <span>{title}</span>
}
type EventsDateFilterProps = {
  fromDate: DateTime | null
  setFromDate: (fromDate: DateTime | null) => void
  fromDateError: string | null
  toDate: DateTime | null
  setToDate: (toDate: DateTime | null) => void
  toDateError: string | null
}
const EventsDateFilter = ({
  fromDate,
  setFromDate,
  fromDateError,
  toDate,
  setToDate,
  toDateError,
}: EventsDateFilterProps): JSX.Element => {
  const defaultFromDate = DateTime.now().startOf('day')
  const defaultToDate = DateTime.now().plus({ year: 1 }).startOf('day')
  const [showDateFilter, setShowDateFilter] = useState(true)
  const isReset = fromDate?.startOf('day').equals(defaultFromDate) && toDate?.startOf('day').equals(defaultToDate)
  const { t } = useTranslation('events')
  return (
    <>
      <DateSection>
        <FilterToggle toggle={showDateFilter} setToggleDateFilter={setShowDateFilter} />
        {showDateFilter && (
          <>
            <DatePicker title={t('from')} date={fromDate} setDate={setFromDate} error={t(fromDateError ?? '')} />
            <DatePicker title={t('to')} date={toDate} setDate={setToDate} error={t(toDateError ?? '')} />
          </>
        )}
      </DateSection>
      {!isReset && showDateFilter && (
        <StyledButton
          label='resetDate'
          onClick={() => {
            setFromDate(defaultFromDate)
            setToDate(defaultToDate)
          }}>
          <Icon src={CloseIcon} />
          <ResetFilterText fromDate={fromDate ?? defaultFromDate} toDate={toDate ?? defaultToDate} />
        </StyledButton>
      )}
    </>
  )
}
export default EventsDateFilter
