import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { CloseIcon } from '../assets'
import DatePicker from './DatePicker'
import FilterToggle from './FilterToggle'
import Icon from './base/Icon'
import Text from './base/Text'

const DateSection = styled.View`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 5px 15px;
  justify-content: center;
  align-items: center;
`
const StyledButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 5px;
  justify-content: center;
  align-self: ${props => (props.theme.contentDirection === 'rtl' ? 'flex-end' : 'flex-start')};
`
const StyledText = styled(Text)`
  font-weight: bold;
  padding: 5px;
`
type ResetFilterTextProps = {
  fromDate: DateTime | null
  toDate: DateTime | null
}

const ResetFilterText = ({ fromDate, toDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const title = `${t('resetFilter')} ${fromDate?.toFormat('dd.MM.yy')} - ${toDate?.toFormat('dd.MM.yy')}`
  return <StyledText>{title}</StyledText>
}

type EventsDateFilterProps = {
  fromDate: DateTime | null
  setFromDate: (fromDate: DateTime | null) => void
  fromDateError: string | null
  toDate: DateTime | null
  setToDate: (fromDate: DateTime | null) => void
  toDateError: string | null
  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
}
const EventsDateFilter = ({
  fromDate,
  setFromDate,
  fromDateError,
  toDate,
  setToDate,
  toDateError,
  modalOpen,
  setModalOpen,
}: EventsDateFilterProps): JSX.Element => {
  const defaultFromDate = DateTime.now().startOf('day')
  const defaultToDate = DateTime.now().plus({ day: 10 }).startOf('day')
  const [toggleDateFilter, setToggleDateFilter] = useState(true)
  const isReset = fromDate?.startOf('day').equals(defaultFromDate) && toDate?.startOf('day').equals(defaultToDate)
  const { t } = useTranslation('events')
  return (
    <>
      <DateSection>
        <FilterToggle toggle={toggleDateFilter} setToggleDateFilter={setToggleDateFilter} />
        {toggleDateFilter && (
          <>
            <DatePicker
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setDate={setFromDate}
              title={t('from')}
              error={t(fromDateError ?? '')}
              date={fromDate}
            />
            <DatePicker
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setDate={setToDate}
              title={t('to')}
              error={t(toDateError ?? '')}
              date={toDate}
            />
          </>
        )}
      </DateSection>
      <>
        {!isReset && toggleDateFilter && (
          <StyledButton
            onPress={() => {
              setFromDate(defaultFromDate)
              setToDate(defaultToDate)
            }}>
            <Icon Icon={CloseIcon} />
            <ResetFilterText fromDate={fromDate ?? defaultFromDate} toDate={toDate ?? defaultToDate} />
          </StyledButton>
        )}
      </>
    </>
  )
}
export default EventsDateFilter
