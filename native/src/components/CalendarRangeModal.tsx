import { DateTime } from 'luxon'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'react-native'
import { Calendar, DayProps } from 'react-native-calendars'
import styled from 'styled-components/native'

import { commonLightColors } from 'build-configs/common/theme/colors'

import { getMarkedDates } from '../utils/calendarRangeUtils'
import Caption from './Caption'
import TextButton from './base/TextButton'

const DatePickerWrapper = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  border-radius: 20px;
  margin: 228px 10px 0;
`
const StyledView = styled.View`
  gap: 8px;
  flex-direction: row;
  justify-content: ${props => (props.theme.contentDirection === 'rtl' ? 'flex-end' : 'flex-start')};
  padding: 5px 10px;
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
    startDate: string
    endDate: string
  }
  const [range, setRange] = React.useState<RangeType>({
    startDate: '',
    endDate: '',
  })
  const { t } = useTranslation('events')

  useEffect(() => {
    if (fromDate.length === DateFormat.length && toDate.length === DateFormat.length) {
      try {
        setRange({
          startDate: fromDate,
          endDate: toDate,
        })
      } catch (e) {
        // console.log(e)
      }
    }
  }, [fromDate, toDate])

  const handleDayPress = (day: DayProps) => {
    if (!range.startDate) {
      setRange({ startDate: day.dateString, endDate: '' })
    } else if (!range.endDate) {
      setRange({ ...range, endDate: day.dateString })
    } else {
      setRange({ startDate: day.dateString, endDate: '' })
    }
  }

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
        <Calendar
          markingType='period'
          markedDates={getMarkedDates(range.startDate, range.endDate)}
          onDayPress={handleDayPress}
          theme={{
            calendarBackground: commonLightColors.textDecorationColor,
            dayTextColor: commonLightColors.textColor,
            textDisabledColor: '#44474A',
            todayTextColor: commonLightColors.backgroundColor,
            textSectionTitleColor: commonLightColors.textColor,
            arrowColor: commonLightColors.textColor,
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
