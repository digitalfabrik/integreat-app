import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { Button, Dialog, Portal } from 'react-native-paper'
import { ThemeProvider, useTheme } from 'styled-components/native'

import { getMarkedDates } from '../utils/calendarRangeUtils'
import Caption from './Caption'

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
})

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
    <Portal>
      <ThemeProvider theme={theme}>
        <Dialog
          style={{ backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.action.disabled }}
          visible={modalVisible}
          onDismiss={closeModal}>
          <Dialog.Content>
            <Caption title={t('selectRange')} />
            <Calendar
              markingType='period'
              markedDates={getMarkedDates(tempStartDate, tempEndDate, theme, currentInput ?? '')}
              onDayPress={handleDayPress}
              theme={{
                calendarBackground: theme.dark ? theme.colors.surfaceVariant : theme.colors.action.disabled,
                dayTextColor: theme.colors.onSurface,
                monthTextColor: theme.colors.onSurface,
                textDisabledColor: theme.colors.onSurfaceVariant,
                todayTextColor: theme.dark ? theme.colors.primary : theme.colors.background,
                textSectionTitleColor: theme.colors.onSurface,
                arrowColor: theme.colors.onSurface,
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={styles.text}
              onPress={() => {
                setTempStartDate(startDate)
                setTempEndDate(endDate)
                closeModal()
              }}>
              {t('layout:cancel')}
            </Button>
            <Button
              labelStyle={styles.text}
              onPress={() => updateCalendar(tempStartDate, tempEndDate, currentInput ?? '')}
              disabled={
                (tempStartDate === null && tempEndDate === null) ||
                !!(tempStartDate && tempEndDate && tempStartDate > tempEndDate)
              }>
              {t('common:ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </ThemeProvider>
    </Portal>
  )
}

export default CalendarRangeModal
