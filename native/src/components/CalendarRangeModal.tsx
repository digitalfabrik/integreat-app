import { DateTime } from 'luxon'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'react-native'
import DateTimePicker, { DateType } from 'react-native-ui-datepicker'
import styled from 'styled-components/native'

import Caption from './Caption'
import TextButton from './base/TextButton'

const DatePickerWrapper = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  border-radius: 10px;
  margin: 228px 10px 0;
`
const StyledView = styled.View`
  gap: 8px;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 10px 5px 5px;
`
const StyledTextButton = styled(TextButton)`
  background-color: transparent;
  transform: scale(0.8);
`
export type CalendarViewerProps = {
  modalVisible: boolean
  closeModal: () => void
  fromDate: string
  toDate: string
  setFromDate: React.Dispatch<React.SetStateAction<string>>
  setToDate: React.Dispatch<React.SetStateAction<string>>
}

const CalendarRangeModal = ({
  modalVisible,
  closeModal,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: CalendarViewerProps): ReactElement => {
  const DateFormat = 'yyyy-MM-dd'
  type RangeType = {
    startDate: DateType
    endDate: DateType
  }
  const [range, setRange] = React.useState<RangeType>({
    startDate: undefined,
    endDate: undefined,
  })
  const { t } = useTranslation('events')

  useEffect(() => {
    if (fromDate.length === DateFormat.length && toDate.length === DateFormat.length) {
      try {
        setRange({
          startDate: DateTime.fromISO(fromDate).toJSDate(),
          endDate: DateTime.fromISO(toDate).toJSDate(),
        })
      } catch (e) {
        // console.log(e)
      }
    }
  }, [fromDate, toDate])

  return (
    <Modal
      style={{ margin: 0 }}
      animationType='slide'
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        closeModal()
      }}>
      <DatePickerWrapper>
        <Caption title={t('select_range')} />
        <DateTimePicker
          mode='range'
          startDate={range.startDate}
          endDate={range.endDate}
          selectedItemColor='#FBDA16'
          selectedTextStyle={{ color: '#000' }}
          onChange={params => {
            setRange(params)
          }}
        />
        <StyledView>
          <StyledTextButton
            onPress={() => {
              try {
                setRange({
                  startDate: DateTime.fromISO(fromDate).toJSDate(),
                  endDate: DateTime.fromISO(toDate).toJSDate(),
                })
              } catch (e) {
                // console.log(e)
              }
              closeModal()
            }}
            text={t('cancel')}
            type='clear'
          />
          <StyledTextButton
            onPress={() => {
              if (Boolean(range.startDate) && Boolean(range.endDate)) {
                setFromDate(DateTime.fromJSDate(new Date(range.startDate)).toFormat(DateFormat))
                setToDate(DateTime.fromJSDate(new Date(range.endDate)).toFormat(DateFormat))
              }
              closeModal()
            }}
            text={t('ok')}
            type='clear'
          />
        </StyledView>
      </DatePickerWrapper>
    </Modal>
  )
}

export default CalendarRangeModal
