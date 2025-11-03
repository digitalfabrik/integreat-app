import { formHelperTextClasses } from '@mui/material/FormHelperText'
import { ThemeProvider, useTheme, styled } from '@mui/material/styles'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateValidationError } from '@mui/x-date-pickers/models'
import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useCityContentParams from '../hooks/useCityContentParams'
import { getDatePickerLocaleText } from '../utils/muiDatePickerLocales'

const DateContainer = styled('div')`
  width: fit-content;
  position: relative;
`

const StyledError = styled('span')`
  color: ${props => props.theme.palette.error.main};
`

const StyledDatePicker = styled(MuiDatePicker)`
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

const DatePicker = ({
  title,
  date,
  setDate,
  error,
  placeholderDate,
  calendarLabel,
}: CustomDatePickerProps): ReactElement => {
  const { t } = useTranslation('events')
  const [validationError, setValidationError] = useState<DateValidationError | null>(null)
  const { languageCode } = useCityContentParams()
  const errorMessage = error ?? (validationError ? t('invalidDate') : null)
  const muiLocaleText = getDatePickerLocaleText(languageCode)
  const currentTheme = useTheme()
  const directionAdjustedTheme = muiLocaleText ? currentTheme : { ...currentTheme, direction: 'ltr' }

  return (
    <DateContainer>
      <ThemeProvider theme={directionAdjustedTheme}>
        <StyledDatePicker
          label={title}
          value={date}
          onChange={setDate}
          localeText={muiLocaleText}
          slotProps={{
            textField: {
              InputLabelProps: { shrink: true },
              placeholder: placeholderDate
                .setLocale(languageCode)
                .toLocaleString({ month: '2-digit', day: '2-digit', year: 'numeric' }),
              helperText: errorMessage ? <StyledError>{errorMessage}</StyledError> : null,
            },
            openPickerButton: {
              'aria-label': calendarLabel,
            },
          }}
          onError={setValidationError}
        />
      </ThemeProvider>
    </DateContainer>
  )
}

export default DatePicker
