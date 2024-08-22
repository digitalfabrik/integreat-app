import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import DateTimePicker, { DateType } from 'react-native-ui-datepicker'
import styled from 'styled-components/native'

import Modal from './Modal'

const DatePickerWrapper = styled.View`
  background-color: ${props => props.theme.colors.backgroundColor};
`

export type CalendarViewerProps = {
  modalVisible: boolean
  closeModal: () => void
  title: string
  fromDate: string
  toDate: string
  setFromDate: React.Dispatch<React.SetStateAction<string>>
  setToDate: React.Dispatch<React.SetStateAction<string>>
}

const CalendarRangeModal = ({
  modalVisible,
  closeModal,
  title,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: CalendarViewerProps): ReactElement => {
  const [range, setRange] = React.useState<{
    startDate: DateType
    endDate: DateType
  }>({ startDate: undefined, endDate: undefined })

  useEffect(() => {
    setRange({ startDate: DateTime.fromISO(fromDate).toJSDate(), endDate: DateTime.fromISO(toDate).toJSDate() })
  }, [])

  useEffect(() => {
    if (Boolean(range.startDate) && Boolean(range.endDate)) {
      setFromDate(
        DateTime.fromISO(new Date(range.startDate).toISOString().split('T')[0]).toFormat('yyyy-MM-dd').toLocaleString(),
      )
      setToDate(
        DateTime.fromISO(new Date(range.endDate).toISOString().split('T')[0]).toFormat('yyyy-MM-dd').toLocaleString(),
      )
    }
  }, [range.startDate, range.endDate, setFromDate, setToDate])

  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle={title}>
      <DatePickerWrapper>
        <DateTimePicker
          mode='range'
          startDate={range.startDate}
          endDate={range.endDate}
          // selectedItemColor='#ffef15'
          onChange={params => {
            setRange(params)
          }}
        />
      </DatePickerWrapper>
    </Modal>
  )
}

export default CalendarRangeModal
