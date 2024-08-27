import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShrinkIcon, ExpandIcon, CloseIcon } from '../assets'
import CustomDatePicker from '../components/CustomDatePicker'
import dimensions from '../constants/dimensions'
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
const HideDateButton = styled(StyledButton)`
  display: none;
  align-self: flex-start;

  @media ${dimensions.smallViewport} {
    display: flex;
  }
`

const DateFilterToggle = ({
  toggle,
  setToggleDateFilter,
  t,
}: {
  toggle: boolean
  setToggleDateFilter: React.Dispatch<React.SetStateAction<boolean>>
  t: TFunction<'events', undefined>
}) => (
  <HideDateButton label='toggleDate' onClick={() => setToggleDateFilter((prev: boolean) => !prev)}>
    <Icon src={toggle ? ShrinkIcon : ExpandIcon} />
    {toggle ? <span>{t('hide_filters')}</span> : <span>{t('show_filters')}</span>}
  </HideDateButton>
)

type EventsDateFilterProps = {
  fromDate: string
  setFromDate: React.Dispatch<React.SetStateAction<string>>
  fromDateError: string | null
  toDate: string
  setToDate: React.Dispatch<React.SetStateAction<string>>
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
  const defaultFromDate = DateTime.local().toFormat('yyyy-MM-dd').toLocaleString()
  const defaultToDate = DateTime.local().plus({ day: 10 }).toFormat('yyyy-MM-dd').toLocaleString()
  const [toggleDateFilter, setToggleDateFilter] = useState(true)
  const isReset = fromDate === defaultFromDate && toDate === defaultToDate
  const { t } = useTranslation('events')
  return (
    <>
      <DateSection>
        <DateFilterToggle toggle={toggleDateFilter} setToggleDateFilter={setToggleDateFilter} t={t} />
        {toggleDateFilter && (
          <>
            <CustomDatePicker title={t('from')} value={fromDate} setValue={setFromDate} error={fromDateError || ''} />
            <CustomDatePicker title={t('to')} value={toDate} setValue={setToDate} error={toDateError || ''} />
          </>
        )}
      </DateSection>
      {!isReset && toggleDateFilter && (
        <StyledButton
          label='resetDate'
          onClick={() => {
            setFromDate(DateTime.local().toFormat('yyyy-MM-dd').toLocaleString())
            setToDate(DateTime.local().plus({ day: 10 }).toFormat('yyyy-MM-dd').toLocaleString())
          }}>
          <Icon src={CloseIcon} />
          <span>{`${t('resetFilter')} ${DateTime.fromISO((fromDate as string) || defaultFromDate).toFormat('dd/MM/yy')} - ${DateTime.fromISO((toDate as string) || defaultFromDate).toFormat('dd/MM/yy')}`}</span>
        </StyledButton>
      )}
    </>
  )
}
export default EventsDateFilter
