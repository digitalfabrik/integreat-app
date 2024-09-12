import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
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
  top: 228px;
  align-self: center;
`
const StyledView = styled.View`
  gap: 8px;
  justify-content: ${props => (props.theme.contentDirection === 'rtl' ? 'flex-start' : 'flex-end')};
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse' : 'row')};
  padding: 5px 10px;
`
const OPACITY_DISABLED = 0.5

const StyledTextButton = styled(TextButton)`
  background-color: transparent;
  transform: scale(0.8);
  opacity: ${props => (props.disabled ? OPACITY_DISABLED : 1)};
`
const StyledPressable = styled.Pressable`
  flex: 1;
`

export type CalendarViewerProps = {
  modalVisible: boolean
  closeModal: () => void
  startDate: DateTime | null
  endDate: DateTime | null
  setStartDate: (startDate: DateTime) => void
  setEndDate: (endDate: DateTime) => void
}

const CalendarRangeModal = ({
  modalVisible,
  closeModal,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: CalendarViewerProps): ReactElement => {
  const [tempStartDate, setTempStartDate] = useState<DateTime | null>(startDate)
  const [tempEndDate, setTempEndDate] = useState<DateTime | null>(endDate)
  const { t } = useTranslation('events')
  const theme = useTheme()

  useEffect(() => {
    setTempStartDate(startDate)
    setTempEndDate(endDate)
  }, [startDate, endDate])

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = DateTime.fromISO(day.dateString)

    if (!tempStartDate || tempEndDate) {
      setTempStartDate(selectedDate)
      setTempEndDate(null)
    } else {
      setTempEndDate(selectedDate)
    }
  }

  return (
    <Modal style={{ margin: 0 }} animationType='slide' transparent visible={modalVisible} onRequestClose={closeModal}>
      <StyledPressable onPress={closeModal} />
      <DatePickerWrapper>
        <Caption title={t('selectRange')} />
        <Calendar
          markingType='period'
          markedDates={getMarkedDates(tempStartDate, tempEndDate, theme)}
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
            onPress={() => {
              setTempStartDate(startDate)
              setTempEndDate(endDate)
              closeModal()
            }}
            text={t('layout:cancel')}
            type='clear'
          />
          <StyledTextButton
            onPress={() => {
              if (tempStartDate && tempEndDate) {
                setStartDate(tempStartDate)
                setEndDate(tempEndDate)
              }
              closeModal()
            }}
            text={t('common:ok')}
            type='clear'
            disabled={tempStartDate === null || tempEndDate === null || tempStartDate > tempEndDate}
          />
        </StyledView>
      </DatePickerWrapper>
    </Modal>
  )
}

export default CalendarRangeModal
