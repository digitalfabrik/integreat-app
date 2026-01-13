import { DateTime } from 'luxon'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { List, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import CalendarRangeModal from './CalendarRangeModal'
import DatePicker from './DatePicker'
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

type ResetFilterTextProps = {
  startDate: DateTime | null
  endDate: DateTime | null
}

const ResetFilterText = ({ startDate, endDate }: ResetFilterTextProps) => {
  const { t } = useTranslation('events')
  const text = `${t('resetFilter')} ${startDate ? startDate.toFormat('dd.MM.yyyy') : '∞'} - ${endDate ? endDate.toFormat('dd.MM.yyyy') : '∞'}`
  return (
    <Text variant='h6' style={{ padding: 6 }}>
      {text}
    </Text>
  )
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
  const theme = useTheme()

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

  const getCurrentIcon = () => (showDateFilter ? <Icon source='chevron-up' /> : <Icon source='chevron-down' />)

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
      <List.Accordion
        title={t(showDateFilter ? 'hideFilters' : 'showFilters')}
        right={getCurrentIcon}
        expanded={showDateFilter}
        titleStyle={{ fontWeight: 'bold', color: theme.colors.onBackground }}
        rippleColor='transparent'
        onPress={() => setShowDateFilter(!showDateFilter)}>
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
      </List.Accordion>
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
