import { DateTime } from 'luxon'
import React, { ReactElement, RefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native'
import styled from 'styled-components/native'

import { CalendarTodayIcon } from '../assets'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const DateContainer = styled.View`
  width: auto;
  position: relative;
`

const Input = styled(TextInput)`
  text-align: center;
  min-width: 20%;
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

const handleKeyPress = (key: string, currentInput: string | undefined, refPrev?: RefObject<TextInput>) => {
  if (key === 'Backspace') {
    if (currentInput?.length === 0 && refPrev) {
      refPrev.current?.focus()
    }
  }
}

const DatePicker = ({ title, date, setDate, error, modalOpen, setModalOpen }: DatePickerProps): ReactElement => {
  const { t } = useTranslation('events')
  const [inputDay, setInputDay] = useState(date?.toFormat('dd'))
  const [inputMonth, setInputMonth] = useState(date?.toFormat('MM'))
  const [inputYear, setInputYear] = useState(date?.toFormat('yyyy'))
  const dayRef = useRef<TextInput>(null)
  const monthRef = useRef<TextInput>(null)
  const yearRef = useRef<TextInput>(null)
  const maxDays = 31
  const maxMonths = 12
  const maxYears = 3000

  useEffect(() => {
    try {
      setDate(DateTime.fromISO(`${inputYear}-${inputMonth}-${inputDay}`))
    } catch (_) {
      // setDate(null)
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

  const handleBlurForDayMonth = (
    inputValue: string | undefined,
    setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>,
    currentValue: number,
  ) => {
    const maxOfTwoDigits = 10
    if (Number(inputValue) !== 0 && inputValue?.length === 1) {
      setInputValue(`0${inputValue}`)
    } else if (inputValue === '00' || inputValue === '0') {
      const formattedValue = currentValue < maxOfTwoDigits ? `0${currentValue}` : `${currentValue}`
      setInputValue(formattedValue)
    }
  }

  const handleBlurForYears = () => {
    const yearLength = 4
    if (inputYear && inputYear.length < yearLength) {
      setInputYear(String(DateTime.now().year))
    } else if (inputYear === '0000') {
      setInputYear(String(DateTime.now().year))
    }
  }

  const handleOnChangeText = (
    text: string,
    setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>,
    maxNumber: number,
    ref?: RefObject<TextInput>,
  ) => {
    if (/^\d*$/.test(text) && Number(text) <= maxNumber) {
      setInputValue(text)
      if (ref && text.length === 2) {
        ref.current?.focus()
      }
    }
  }

  return (
    <DateContainer>
      <StyledTitle>{title}</StyledTitle>
      <StyledInputWrapper>
        <Wrapper>
          <Input
            ref={dayRef}
            placeholder={t('dd')}
            testID='DatePicker-day'
            keyboardType='numeric'
            maxLength={2}
            onBlur={() => handleBlurForDayMonth(inputDay, setInputDay, DateTime.now().day)}
            onChangeText={text => {
              handleOnChangeText(text, setInputDay, maxDays, monthRef)
            }}
            selectTextOnFocus
            value={inputDay}
          />
          <Text>.</Text>
          <Input
            ref={monthRef}
            placeholder={t('mm')}
            testID='DatePicker-month'
            keyboardType='numeric'
            maxLength={2}
            onBlur={() => handleBlurForDayMonth(inputMonth, setInputMonth, DateTime.now().month)}
            onChangeText={text => {
              handleOnChangeText(text, setInputMonth, maxMonths, yearRef)
            }}
            selectTextOnFocus
            value={inputMonth}
            onKeyPress={({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
              handleKeyPress(nativeEvent.key, inputMonth, dayRef)
            }}
          />
          <Text>.</Text>
          <Input
            style={{ marginLeft: 6 }}
            ref={yearRef}
            placeholder={t('yyyy')}
            testID='DatePicker-year'
            maxLength={4}
            keyboardType='numeric'
            onBlur={handleBlurForYears}
            onChangeText={text => {
              handleOnChangeText(text, setInputYear, maxYears)
            }}
            onKeyPress={({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
              handleKeyPress(nativeEvent.key, inputYear, monthRef)
            }}
            selectTextOnFocus
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
