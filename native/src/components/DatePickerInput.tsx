import { DateTime } from 'luxon'
import React, { forwardRef, ReactElement, RefObject } from 'react'
import { NativeSyntheticEvent, StyleProp, TextInput, TextInputKeyPressEventData, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { zeroPad } from 'shared/utils/dateFilterUtils'

const Input = styled(TextInput)`
  text-align: center;
  min-width: 20%;
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

const handleInputChangeAndFocusNext = (
  text: string,
  setInputValue: (newValue: string | undefined) => void,
  ref?: RefObject<TextInput>,
) => {
  setInputValue(text)
  if (ref && text.length === 2) {
    ref.current?.focus()
  }
}

const handleKeyPress = (key: string, currentInput: string | undefined, refPrev?: RefObject<TextInput>) => {
  if (key === 'Backspace') {
    if (currentInput?.length === 0 && refPrev) {
      refPrev.current?.focus()
    }
  }
}

type DatePickerInputProps = {
  nextTargetRef?: RefObject<TextInput>
  prevTargetRef?: RefObject<TextInput>
  placeholder: string
  type: 'day' | 'month' | 'year'
  inputValue: string | undefined
  setInputValue: (newValue: string | undefined) => void
  style?: StyleProp<ViewStyle>
}

const DatePickerInput = forwardRef<TextInput, DatePickerInputProps>(
  ({ nextTargetRef, prevTargetRef, placeholder, type, inputValue, setInputValue, style }, ref): ReactElement => {
    const theme = useTheme()
    return (
      <Input
        style={style}
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={theme.isContrastTheme ? theme.colors.textColor : theme.colors.textSecondaryColor}
        keyboardType='numeric'
        maxLength={type === 'year' ? yearLength : 2}
        onBlur={() => validate(inputValue, setInputValue, type)}
        onChangeText={text => {
          handleInputChangeAndFocusNext(text, setInputValue, nextTargetRef)
        }}
        selectTextOnFocus
        value={inputValue}
        onKeyPress={({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
          handleKeyPress(nativeEvent.key, inputValue, prevTargetRef)
        }}
      />
    )
  },
)
export default DatePickerInput
