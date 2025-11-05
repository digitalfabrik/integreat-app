import { ThemeProvider, useTheme, styled } from '@mui/material/styles'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateValidationError } from '@mui/x-date-pickers/models'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useCityContentParams from '../hooks/useCityContentParams'
import { getDatePickerLocaleText } from '../utils/muiDatePickerLocales'

const StyledError = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}))

const StyledDatePicker = styled(MuiDatePicker)({
  width: 240,
})

export type CustomDatePickerProps = {
  title: string
  date?: DateTime | null
  setDate: (date: DateTime | null) => void
  error?: string
  calendarLabel: string
}

const DatePicker = ({ title, date, setDate, error, calendarLabel }: CustomDatePickerProps): ReactElement => {
  const { t } = useTranslation('events')
  const [validationError, setValidationError] = useState<DateValidationError | null>(null)
  const { languageCode } = useCityContentParams()
  const errorMessage = error ?? (validationError ? t('invalidDate') : null)
  const muiLocaleText = getDatePickerLocaleText(languageCode)
  const currentTheme = useTheme()
  const directionAdjustedTheme = muiLocaleText ? currentTheme : { ...currentTheme, direction: 'ltr' }

  return (
    <ThemeProvider theme={directionAdjustedTheme}>
      <StyledDatePicker
        label={title}
        value={date}
        onChange={setDate}
        localeText={muiLocaleText}
        slotProps={{
          textField: {
            InputLabelProps: { shrink: true },
            helperText: errorMessage ? <StyledError>{errorMessage}</StyledError> : null,
          },
          openPickerButton: {
            'aria-label': calendarLabel,
          },
        }}
        onError={setValidationError}
      />
    </ThemeProvider>
  )
}

export default DatePicker
