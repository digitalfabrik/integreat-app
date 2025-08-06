import styled from '@emotion/styled'
import { formHelperTextClasses } from '@mui/material/FormHelperText'
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
const StyledDatePicker = styled(DatePicker)`
  margin-bottom: 8px;
  .${formHelperTextClasses.root} {
    margin-top: 0;
  }
`

export type CustomDatePickerProps = {
  title: string
  date?: DateTime | null
  setDate: (date: DateTime | null) => void
  error?: string
  placeholderDate: DateTime
  calendarLabel: string
}

// AdapterLuxon doesn't support (throwOnInvalid = true) so I overridden parse and getInvalidDate.
// https://mui.com/x/react-date-pickers/adapters-locale/#with-luxon
export class CustomAdapterLuxon extends AdapterLuxon {
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
  const { languageCode } = useCityContentParams()

  const maxDate = DateTime.fromISO('2099-12-31')
  const minDate = DateTime.now().minus({ days: 1 })
  const isWithinRange = (newValue: DateTime<true>) => newValue > minDate && newValue < maxDate

  const handleDateChange = (newValue: DateTime | null) => {
    if (newValue && isWithinRange(newValue)) {
      setDate(newValue)
      setDatePickerError('')
    }
  }

  useEffect(() => {
    if (date == null) {
      setDatePickerError('')
    }
  }, [date])

  return (
    <DateContainer>
      <LocalizationProvider dateAdapter={CustomAdapterLuxon} adapterLocale={languageCode}>
        <StyledDatePicker
          disablePast
          minDate={minDate}
          maxDate={maxDate}
          label={title}
          value={date}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              InputLabelProps: { shrink: true },
              placeholder: placeholderDate
                .setLocale(languageCode)
                .toLocaleString({ month: '2-digit', day: '2-digit', year: 'numeric' }),
              helperText: error || datePickerError || null,
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
    </DateContainer>
  )
}

export default CustomDatePicker
