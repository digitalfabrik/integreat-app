import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput, View } from 'react-native'
import styled from 'styled-components/native'

import { CalendarTodayIcon } from '../assets'
import DatePickerInput from './DatePickerInput'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

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
  font-size: 12px;
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
  const { t } = useTranslation('events')
  const [inputDay, setInputDay] = useState(date?.toFormat('dd'))
  const [inputMonth, setInputMonth] = useState(date?.toFormat('MM'))
  const [inputYear, setInputYear] = useState(date?.toFormat('yyyy'))
  const [datePickerError, setDatePickerError] = useState('')
  const dayRef = useRef<TextInput>(null)
  const monthRef = useRef<TextInput>(null)
  const yearRef = useRef<TextInput>(null)

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
          <DatePickerInput
            ref={dayRef}
            placeholder={t('dd')}
            nextTargetRef={monthRef}
            inputValue={inputDay}
            setInputValue={setInputDay}
            type='day'
          />
          <Text>.</Text>
          <DatePickerInput
            ref={monthRef}
            placeholder={t('mm')}
            nextTargetRef={yearRef}
            prevTargetRef={dayRef}
            inputValue={inputMonth}
            setInputValue={setInputMonth}
            type='month'
          />
          <Text>.</Text>
          <DatePickerInput
            style={{ marginLeft: 6 }}
            ref={yearRef}
            prevTargetRef={monthRef}
            placeholder={t('yyyy')}
            inputValue={inputYear}
            setInputValue={setInputYear}
            type='year'
          />
        </Wrapper>
        <StyledIconButton
          $isModalOpen={modalOpen}
          icon={<Icon Icon={CalendarTodayIcon} />}
          accessibilityLabel={t('common:openCalendar')}
          onPress={() => {
            setModalOpen(true)
          }}
        />
      </StyledInputWrapper>
      <View style={{ width: '80%' }}>
        {!!(error || datePickerError) && <StyledError>{error || datePickerError}</StyledError>}
      </View>
    </DateContainer>
  )
}

export default DatePicker
