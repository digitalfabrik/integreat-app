import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { DATE_FORMAT } from 'shared/constants'

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
  value: DateTime | null
  setValue: (fromDate: DateTime | null) => void
  error?: string
  modalState: boolean
  setModalState: React.Dispatch<React.SetStateAction<boolean>>
}
const DatePicker = ({ title, value, setValue, error, modalState, setModalState }: DatePickerProps): ReactElement => {
  const formatDate = (date: DateTime | null, part: number) => date?.toFormat(DATE_FORMAT).split('/')[part]

  const [inputDay, setInputDay] = useState(formatDate(value, 0))
  const [inputMonth, setInputMonth] = useState(formatDate(value, 1))
  const [inputYear, setInputYear] = useState(formatDate(value, 2))

  useEffect(() => {
    try {
      setValue(DateTime.fromFormat(`${inputDay}/${inputMonth}/${inputYear}`, DATE_FORMAT).toLocal())
    } catch (e) {
      setValue(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputDay, inputMonth, inputYear])

  useEffect(() => {
    if (value) {
      setInputDay(formatDate(value, 0))
      setInputMonth(formatDate(value, 1))
      setInputYear(formatDate(value, 2))
    }
  }, [value])

  return (
    <DateContainer>
      <StyledTitle>{title}</StyledTitle>
      <StyledInputWrapper>
        <Wrapper>
          <Input
            testID='DatePicker-day'
            keyboardType='numeric'
            maxLength={2}
            onChangeText={event => {
              setInputDay(event as string)
            }}
            value={inputDay}
          />
          <Text>/</Text>
          <Input
            testID='DatePicker-month'
            keyboardType='numeric'
            maxLength={2}
            onChangeText={event => {
              setInputMonth(event)
            }}
            value={inputMonth}
          />
          <Text>/</Text>
          <Input
            testID='DatePicker-year'
            maxLength={4}
            keyboardType='numeric'
            onChangeText={event => {
              setInputYear(event)
            }}
            value={inputYear}
          />
        </Wrapper>
        <StyledIconButton
          $isModalOpen={modalState}
          icon={<Icon Icon={CalendarTodayIcon} />}
          accessibilityLabel='calenderEventsIcon'
          onPress={() => {
            setModalState(true)
          }}
        />
      </StyledInputWrapper>
      {!!error && <StyledError>{error}</StyledError>}
    </DateContainer>
  )
}

export default DatePicker
