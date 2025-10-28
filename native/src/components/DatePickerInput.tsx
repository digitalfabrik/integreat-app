import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { zeroPad } from 'shared'

const Input = styled.TextInput`
  text-align: center;
  min-width: 25%;
  color: ${props => props.theme.colors.textColor};
`

const containsOnlyDigits = (str: string) => !Number.isNaN(Number(str))

const yearLength = 4

const validate = (
  inputValue: string | undefined,
  setInputValue: (newValue: string | undefined) => void,
  type: 'day' | 'month' | 'year',
) => {
  if (type === 'year') {
    if (
      (inputValue && inputValue.length < yearLength) ||
      inputValue === '0000' ||
      !containsOnlyDigits(inputValue ?? '')
    ) {
      setInputValue(String(DateTime.now().year))
    }
    return
  }
  const maxValidDay = 31
  const maxValidMonth = 12
  const maxValidNumber = type === 'day' ? maxValidDay : maxValidMonth
  if (Number(inputValue) !== 0 && inputValue?.length === 1 && containsOnlyDigits(inputValue)) {
    setInputValue(zeroPad(inputValue))
  } else if (
    inputValue === '00' ||
    inputValue === '0' ||
    Number(inputValue) > maxValidNumber ||
    !containsOnlyDigits(inputValue ?? '')
  ) {
    const currentValue = type === 'day' ? DateTime.now().day : DateTime.now().month
    setInputValue(zeroPad(String(currentValue)))
  }
}

type DatePickerInputProps = {
  placeholder: string
  type: 'day' | 'month' | 'year'
  inputValue: string | undefined
  setInputValue: (newValue: string | undefined) => void
  style?: StyleProp<ViewStyle>
}

const DatePickerInput = ({
  placeholder,
  type,
  inputValue,
  setInputValue,
  style,
}: DatePickerInputProps): ReactElement => {
  const theme = useTheme()
  return (
    <Input
      style={style}
      placeholder={placeholder}
      placeholderTextColor={theme.isContrastTheme ? theme.colors.textColor : theme.colors.textSecondaryColor}
      keyboardType='numeric'
      maxLength={type === 'year' ? yearLength : 2}
      onBlur={() => validate(inputValue, setInputValue, type)}
      onChangeText={setInputValue}
      selectTextOnFocus
      value={inputValue}
    />
  )
}

export default DatePickerInput
