import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'react-native'
import { Calendar } from 'react-native-calendars'
import styled, { useTheme } from 'styled-components/native'

import { getMarkedDates } from '../utils/calendarRangeUtils'
import Caption from './Caption'
import TextButton from './base/TextButton'

const DatePickerWrapper = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  border-radius: 20px;
  position: absolute;
  width: 90%;
  top: 25%;
  align-self: center;
`

const StyledView = styled.View`
  gap: 8px;
  justify-content: ${props => (props.theme.contentDirection === 'rtl' ? 'flex-start' : 'flex-end')};
  flex-direction: row;
  padding: 5px 14px;
`

const DISABLED_OPACITY = 0.5

const StyledTextButton = styled(TextButton)`
  background-color: transparent;
  opacity: ${props => (props.disabled ? DISABLED_OPACITY : 1)};
  height: 40px;
`

const Background = styled.Pressable`
  flex: 1;
`

export type CalendarViewerProps = {
  modalVisible: boolean
  closeModal: () => void
  startDate: DateTime | null
  endDate: DateTime | null
  setStartDate: (startDate: DateTime) => void
  setEndDate: (endDate: DateTime) => void
  currentInput?: string
}

const CalendarRangeModal = ({
  modalVisible,
  closeModal,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  currentInput,
}: CalendarViewerProps): ReactElement => {
  const [tempStartDate, setTempStartDate] = useState<DateTime | null>(startDate)
  const [tempEndDate, setTempEndDate] = useState<DateTime | null>(endDate)
  const { t } = useTranslation('events')
  const theme = useTheme()

  const textButtonStyles = {
    text: {
      fontSize: 16,
    },
  }

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = DateTime.fromISO(day.dateString)

    if (!tempStartDate || tempEndDate) {
      setTempStartDate(selectedDate)
      setTempEndDate(null)
    } else {
      setTempEndDate(selectedDate)
    }
  }

  const updateCalendar = (
    tempStartDate: DateTime<true> | null,
    tempEndDate: DateTime<true> | null,
    currentInput: string,
  ) => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate)
      setEndDate(tempEndDate)
    } else if (tempStartDate && tempEndDate == null) {
      const updatingFunction = currentInput === 'from' ? setStartDate : setEndDate
      updatingFunction(tempStartDate)
    }
    setTempStartDate(null)
    setTempEndDate(null)
    closeModal()
  }

  return (
    <Modal animationType='slide' transparent visible={modalVisible} onRequestClose={closeModal}>
      <Background onPress={closeModal} />
      <DatePickerWrapper>
        <Caption title={t('selectRange')} />
        <Calendar
          markingType='period'
          markedDates={getMarkedDates(tempStartDate, tempEndDate, theme, currentInput ?? '')}
          onDayPress={handleDayPress}
          theme={{
            calendarBackground: theme.colors.textDecorationColor,
            dayTextColor: theme.colors.textColor,
            textDisabledColor: theme.colors.textSecondaryColor,
            todayTextColor: theme.colors.backgroundColor,
            textSectionTitleColor: theme.colors.textColor,
            arrowColor: theme.colors.textColor,
          }}
        />
        <StyledView>
          <StyledTextButton
            textStyle={textButtonStyles.text}
            onPress={() => {
              setTempStartDate(startDate)
              setTempEndDate(endDate)
              closeModal()
            }}
            text={t('layout:cancel')}
            type='clear'
          />
          <StyledTextButton
            textStyle={textButtonStyles.text}
            onPress={() => updateCalendar(tempStartDate, tempEndDate, currentInput ?? '')}
            text={t('common:ok')}
            type='clear'
            disabled={
              (tempStartDate === null && tempEndDate === null) ||
              !!(tempStartDate && tempEndDate && tempStartDate > tempEndDate)
            }
          />
        </StyledView>
      </DatePickerWrapper>
    </Modal>
  )
}

export default CalendarRangeModal
