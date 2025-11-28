import { DateTime } from 'luxon'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import Accordion from './Accordion'
import CalendarRangeModal from './CalendarRangeModal'
import DatePicker from './DatePicker'
import FilterToggle from './FilterToggle'
import Icon from './base/Icon'
import Text from './base/Text'

const DateSection = styled.View`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 15px 5px;
  align-items: center;
`

const StyledButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

const StyledText = styled(Text)`
  font-weight: bold;
  padding: 5px;
  color: ${props => props.theme.legacy.colors.textColor};
`

type ResetFilterTextProps = {
  startDate: DateTime | null
  endDate: DateTime | null
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const text = `${t('resetFilter')} ${startDate ? startDate.toFormat('dd.MM.yyyy') : '∞'} - ${endDate ? endDate.toFormat('dd.MM.yyyy') : '∞'}`
  return <StyledText>{text}</StyledText>
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
}: EventsDateFilterProps): ReactElement => {
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { t } = useTranslation('events')
  const currentInput = useRef<string>('from')

  const today = DateTime.now()
  const inAWeek = DateTime.now().plus({ week: 1 })

  const setModalOpenAndCurrentInputFrom = (openModal: boolean) => {
    currentInput.current = 'from'
    setModalOpen(openModal)
  }
  const setModalOpenAndCurrentInputTo = (openModal: boolean) => {
    currentInput.current = 'to'
    setModalOpen(openModal)
  }

  return (
    <>
      {modalOpen && (
        <CalendarRangeModal
          closeModal={() => setModalOpen(false)}
          modalVisible
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          currentInput={currentInput.current}
        />
      )}
      <FilterToggle isDateFilterActive={showDateFilter} setToggleDateFilter={setShowDateFilter} />
      <Accordion isOpen={showDateFilter} viewKey='Accordion'>
        {showDateFilter ? (
          <DateSection>
            <>
              <DatePicker
                modalOpen={modalOpen}
                setModalOpen={setModalOpenAndCurrentInputFrom}
                setDate={setStartDate}
                title={t('from')}
                error={startDateError ? t(startDateError) : ''}
                date={startDate}
                placeholderDate={today}
                calendarLabel={t('selectStartDateCalendar')}
              />
              <DatePicker
                modalOpen={modalOpen}
                setModalOpen={setModalOpenAndCurrentInputTo}
                setDate={setEndDate}
                title={t('to')}
                date={endDate}
                placeholderDate={inAWeek}
                calendarLabel={t('selectEndDateCalendar')}
              />
            </>
          </DateSection>
        ) : null}
      </Accordion>
      <>
        {(startDate || endDate) && (
          <StyledButton
            onPress={() => {
              setStartDate(null)
              setEndDate(null)
            }}>
            <Icon source='close' />
            <ResetFilterText startDate={startDate} endDate={endDate} />
          </StyledButton>
        )}
      </>
    </>
  )
}

export default EventsDateFilter
