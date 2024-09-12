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
  startDate: DateTime
  endDate: DateTime
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const title = `${t('resetFilter')} ${startDate.toFormat('dd.MM.yy')} - ${endDate.toFormat('dd.MM.yy')}`
  return <StyledText>{title}</StyledText>
}

type EventsDateFilterProps = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  startDateError: string | null
  endDate: DateTime | null
  setEndDate: (startDate: DateTime | null) => void
  endDateError: string | null
  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
  setIsClear: (clear: boolean) => void
}
const EventsDateFilter = ({
  startDate,
  setStartDate,
  startDateError,
  endDate,
  setEndDate,
  endDateError,
  modalOpen,
  setModalOpen,
  setIsClear,
}: EventsDateFilterProps): JSX.Element => {
  const defaultStartDate = DateTime.now().startOf('day')
  const defaultEndDate = DateTime.now().plus({ year: 1 }).startOf('day')
  const [showDateFilter, setShowDateFilter] = useState(false)
  const isReset = startDate?.startOf('day').equals(defaultStartDate) && endDate?.startOf('day').equals(defaultEndDate)
  const { t } = useTranslation('events')
  let firstToggle = true

  const handleToggle = (toggleState: boolean) => {
    setShowDateFilter(toggleState)
    if (firstToggle) {
      setIsClear(false)
      firstToggle = false
    }
  }
  return (
    <>
      <DateSection>
        <FilterToggle toggle={showDateFilter} setToggleDateFilter={handleToggle} />
        {showDateFilter && (
          <>
            <DatePicker
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setDate={setStartDate}
              title={t('from')}
              error={t(startDateError ?? '')}
              date={startDate}
            />
            <DatePicker
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setDate={setEndDate}
              title={t('to')}
              error={t(endDateError ?? '')}
              date={endDate}
            />
          </>
        )}
      </DateSection>
      <>
        {!isReset && showDateFilter && (
          <StyledButton
            onPress={() => {
              setStartDate(defaultStartDate)
              setEndDate(defaultEndDate)
            }}>
            <Icon Icon={CloseIcon} />
            <ResetFilterText startDate={startDate ?? defaultStartDate} endDate={endDate ?? defaultEndDate} />
          </StyledButton>
        )}
      </>
    </>
  )
}
export default EventsDateFilter
