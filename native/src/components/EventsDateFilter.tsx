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
  startDate: DateTime | null
  endDate: DateTime | null
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const title = `${t('resetFilter')} ${startDate?.toLocaleString() ?? '∞'} - ${endDate?.toLocaleString() ?? '∞'}`
  return <StyledText>{title}</StyledText>
}

type EventsDateFilterProps = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  startDateError: string | null
  endDate: DateTime | null
  setEndDate: (startDate: DateTime | null) => void
  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
}
const EventsDateFilter = ({
  startDate,
  setStartDate,
  startDateError,
  endDate,
  setEndDate,
  modalOpen,
  setModalOpen,
}: EventsDateFilterProps): JSX.Element => {
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { t } = useTranslation('events')
  return (
    <>
      <DateSection>
        <FilterToggle toggle={showDateFilter} setToggleDateFilter={setShowDateFilter} />
        {showDateFilter && (
          <>
            <DatePicker
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setDate={setStartDate}
              title={t('from')}
              error={startDateError ? t(startDateError) : ''}
              date={startDate}
            />
            <DatePicker
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setDate={setEndDate}
              title={t('to')}
              date={endDate}
            />
          </>
        )}
      </DateSection>
      <>
        {(startDate || endDate) && (
          <StyledButton
            onPress={() => {
              setStartDate(null)
              setEndDate(null)
            }}>
            <Icon Icon={CloseIcon} />
            <ResetFilterText startDate={startDate} endDate={endDate} />
          </StyledButton>
        )}
      </>
    </>
  )
}
export default EventsDateFilter
