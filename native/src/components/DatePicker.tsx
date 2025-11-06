import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CalendarTodayIcon } from '../assets'
import DatePickerInput from './DatePickerInput'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const DateContainer = styled.View`
  width: auto;
  position: relative;
`

const StyledInputWrapper = styled.View`
  min-width: 80%;
  height: 56px;
  padding: 0 16px;
  border-radius: 8px;
  border-color: ${props => props.theme.colors.themeColorLight};
  border-width: 3px;
  border-style: solid;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 50%;
`

const StyledText = styled.Text`
  color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.textColor : props.theme.colors.textSecondaryColor};
`

const StyledIconButton = styled(IconButton)<{ $isModalOpen: boolean }>`
  width: 40px;
  height: 40px;
  background-color: ${props =>
    props.$isModalOpen ? props.theme.colors.themeColorLight : props.theme.colors.textDisabledColor};
`

const StyledTitle = styled.Text`
  background-color: ${props => props.theme.colors.backgroundColor};
  position: absolute;
  top: -12px;
  left: 12px;
  padding: 2px 5px;
  color: ${props => props.theme.colors.textColor};
  font-size: 12px;
  z-index: 1;
`

const StyledError = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.invalidInput};
`

const StyledCalendarIcon = styled(Icon)`
  color: ${props => (props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
`

export type DatePickerProps = {
  title: string
  date: DateTime | null
  setDate: (date: DateTime | null) => void
  error?: string
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  placeholderDate: DateTime
  calendarLabel: string
}

const DatePicker = ({
  title,
  date,
  setDate,
  error,
  modalOpen,
  setModalOpen,
  placeholderDate,
  calendarLabel,
}: DatePickerProps): ReactElement => {
  const [inputDay, setInputDay] = useState(date?.toFormat('dd'))
  const [inputMonth, setInputMonth] = useState(date?.toFormat('MM'))
  const [inputYear, setInputYear] = useState(date?.toFormat('yyyy'))
  const [datePickerError, setDatePickerError] = useState('')
  const placeholderDay = placeholderDate.toFormat('dd')
  const placeholderMonth = placeholderDate.toFormat('MM')
  const placeholderYear = placeholderDate.toFormat('yyyy')

  useEffect(() => {
    try {
      setDatePickerError('')
      setDate(DateTime.fromISO(`${inputYear}-${inputMonth}-${inputDay}`))
    } catch (e) {
      // This will detect out of range for days
      if (!String(e).includes('ISO')) {
        setDatePickerError(String(e).replace('Error: ', ''))
      }
    }
  }, [inputDay, inputMonth, inputYear, setDate])

  useEffect(() => {
    if (date) {
      setInputDay(date.toFormat('dd'))
      setInputMonth(date.toFormat('MM'))
      setInputYear(date.toFormat('yyyy'))
    } else {
      setInputDay('')
      setInputMonth('')
      setInputYear('')
    }
  }, [date])

  return (
    <DateContainer>
      <StyledTitle>{title}</StyledTitle>
      <StyledInputWrapper>
        <Wrapper>
          <DatePickerInput placeholder={placeholderDay} inputValue={inputDay} setInputValue={setInputDay} type='day' />
          <StyledText>.</StyledText>
          <DatePickerInput
            placeholder={placeholderMonth}
            inputValue={inputMonth}
            setInputValue={setInputMonth}
            type='month'
          />
          <StyledText>.</StyledText>
          <DatePickerInput
            style={{ marginLeft: 6 }}
            placeholder={placeholderYear}
            inputValue={inputYear}
            setInputValue={setInputYear}
            type='year'
          />
        </Wrapper>
        <StyledIconButton
          $isModalOpen={modalOpen}
          icon={<StyledCalendarIcon Icon={CalendarTodayIcon} />}
          accessibilityLabel={calendarLabel}
          onPress={() => setModalOpen(true)}
        />
      </StyledInputWrapper>
      <View style={{ width: '80%' }}>
        {!!(error || datePickerError) && <StyledError>{error || datePickerError}</StyledError>}
      </View>
    </DateContainer>
  )
}

export default DatePicker
