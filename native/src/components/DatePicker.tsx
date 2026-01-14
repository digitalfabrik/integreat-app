import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

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
  border-color: ${props => props.theme.colors.action.disabled};
  border-width: 1px;
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
  const theme = useTheme()

  const styles = StyleSheet.create({
    styledTitle: {
      backgroundColor: theme.colors.background,
      position: 'absolute',
      top: -12,
      left: 12,
      padding: 2,
      paddingHorizontal: 5,
      zIndex: 1,
    },
    styledError: {
      color: theme.colors.error,
    },
  })

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
      <Text variant='body3' style={styles.styledTitle}>
        {title}
      </Text>
      <StyledInputWrapper>
        <Wrapper>
          <DatePickerInput placeholder={placeholderDay} inputValue={inputDay} setInputValue={setInputDay} type='day' />
          <Text variant='body2'>.</Text>
          <DatePickerInput
            placeholder={placeholderMonth}
            inputValue={inputMonth}
            setInputValue={setInputMonth}
            type='month'
          />
          <Text variant='body2'>.</Text>
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
          icon={<Icon color={theme.colors.onSurface} source='calendar' />}
          accessibilityLabel={calendarLabel}
          onPress={() => setModalOpen(true)}
        />
      </StyledInputWrapper>
      <View style={{ width: '80%' }}>
        {!!(error || datePickerError) && (
          <Text variant='body3' style={styles.styledError}>
            {error || datePickerError}
          </Text>
        )}
      </View>
    </DateContainer>
  )
}

export default DatePicker
