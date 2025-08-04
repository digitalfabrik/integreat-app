import styled from '@emotion/styled'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useCityContentParams from '../hooks/useCityContentParams'

const DateContainer = styled.div`
  width: fit-content;
  position: relative;
`

const StyledTitle = styled.span`
  background-color: ${props => props.theme.colors.backgroundColor};
  position: absolute;
  top: -12px;
  left: 12px;
  padding: 2px 4px;
  font-size: 12px;
`

const StyledError = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.invalidInput};
`

export type CustomDatePickerProps = {
  title: string
  date?: DateTime | null
  setDate: (date: DateTime | null) => void
  error?: string
  placeholderDate: DateTime
  calendarLabel: string
}

const isValidJsDate = (date: Date | null): boolean => {
  if (date == null) {
    return false
  }
  const checkDate = DateTime.fromJSDate(date)
  const maxValidYear = 2500
  return checkDate.year <= maxValidYear
}

class CustomAdapterLuxon extends AdapterLuxon {
  parse = (value: string, format: string): DateTime | null => {
    try {
      return DateTime.fromFormat(value, format)
    } catch (_) {
      return null
    }
  }

  getInvalidDate = (): DateTime => DateTime.now()
}

const CustomDatePicker = ({
  title,
  date,
  setDate,
  error,
  placeholderDate,
  calendarLabel,
}: CustomDatePickerProps): ReactElement => {
  const { t } = useTranslation('events')
  const [datePickerError, setDatePickerError] = useState('')
  const [value, setValue] = useState('')
  const { languageCode } = useCityContentParams()

  const maxInputLength = 10

  const handleDateChange = (date: Date | null) => {
    if (isValidJsDate(date)) {
      setDate(DateTime.fromJSDate(date ?? new Date()))
    } else if (value.length < maxInputLength) {
      setDatePickerError(t('invalidDate'))
    }
  }
  useEffect(() => {
    if (date == null) {
      setValue('')
      setDatePickerError('')
    }
  }, [date])

  return (
    <DateContainer>
      <LocalizationProvider dateAdapter={CustomAdapterLuxon} adapterLocale={languageCode}>
        <DatePicker
          value={date}
          onChange={newValue => {
            if (newValue) {
              handleDateChange(newValue.toJSDate())
              setValue(newValue.toFormat('dd.MM.yyyy'))
              setDatePickerError('')
            }
          }}
          slotProps={{
            textField: {
              placeholder: placeholderDate.setLocale(languageCode).toLocaleString(),
            },
            openPickerButton: {
              'aria-label': calendarLabel,
            },
          }}
          onError={reason => {
            if (reason) {
              setDatePickerError(t('invalidDate'))
            }
          }}
        />
      </LocalizationProvider>
      <StyledTitle>{title}</StyledTitle>
      {error || datePickerError ? <StyledError>{error || datePickerError}</StyledError> : null}
    </DateContainer>
  )
}

export default CustomDatePicker
