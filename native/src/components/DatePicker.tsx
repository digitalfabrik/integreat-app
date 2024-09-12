import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { CalendarTodayIcon } from '../assets'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const DateContainer = styled.View`
  width: fit-content;
  position: relative;
`
const Input = styled.TextInput`
  text-align: center;
`
const StyledInputWrapper = styled.View`
  min-width: 316px;
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
  justify-content: space-between;
  align-items: center;
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
  right: auto;
  padding: 2px 5px;
  font-size: 12px;
  font-weight: 400;
  z-index: 1;
`
const StyledError = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.invalidInput};
`
export type DatePickerProps = {
  title: string
  date: DateTime | null
  setDate: (date: DateTime | null) => void
  error?: string
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
}
const DatePicker = ({ title, date, setDate, error, modalOpen, setModalOpen }: DatePickerProps): ReactElement => {
  const [inputDay, setInputDay] = useState(date?.toFormat('dd'))
  const [inputMonth, setInputMonth] = useState(date?.toFormat('MM'))
  const [inputYear, setInputYear] = useState(date?.toFormat('yyyy'))

  useEffect(() => {
    try {
      setDate(DateTime.fromISO(`${inputYear}-${inputMonth}-${inputDay}`))
    } catch (e) {
      setDate(null)
    }
  }, [inputDay, inputMonth, inputYear, setDate])

  useEffect(() => {
    if (date) {
      setInputDay(date.toFormat('dd'))
      setInputMonth(date.toFormat('MM'))
      setInputYear(date.toFormat('yyyy'))
    }
  }, [date])

  return (
    <DateContainer>
      <StyledTitle>{title}</StyledTitle>
      <StyledInputWrapper>
        <Wrapper>
          <Input
            testID='DatePicker-day'
            keyboardType='numeric'
            maxLength={2}
            onChangeText={setInputDay}
            value={inputDay}
          />
          <Text>.</Text>
          <Input
            testID='DatePicker-month'
            keyboardType='numeric'
            maxLength={2}
            onChangeText={setInputMonth}
            value={inputMonth}
          />
          <Text>.</Text>
          <Input
            testID='DatePicker-year'
            maxLength={4}
            keyboardType='numeric'
            onChangeText={setInputYear}
            value={inputYear}
          />
        </Wrapper>
        <StyledIconButton
          $isModalOpen={modalOpen}
          icon={<Icon Icon={CalendarTodayIcon} />}
          accessibilityLabel='calenderEventsIcon'
          onPress={() => {
            setModalOpen(true)
          }}
        />
      </StyledInputWrapper>
      {!!error && <StyledError>{error}</StyledError>}
    </DateContainer>
  )
}

export default DatePicker
