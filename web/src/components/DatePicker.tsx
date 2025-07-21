import styled from '@emotion/styled'
import EventIcon from '@mui/icons-material/Event'
import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker, { DatePickerProps } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTranslation } from 'react-i18next'

import '../styles/DatePickerCalendar.css'
import CustomIconButton from './base/CustomIconButton'

const INPUT_HEIGHT = '56px'

const DateContainer = styled.div`
  width: fit-content;
  position: relative;
`

const StyledInputWrapper = styled.div`
  display: flex;
`

const StyledIconButton = styled(CustomIconButton)<{ isCalendarOpen: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 16px;
  align-self: center;
  background-color: ${props =>
    props.isCalendarOpen ? props.theme.colors.themeColorLight : props.theme.colors.textDisabledColor};
`
const DatePickerWrapper: React.FC<DatePickerProps> = props => <DatePicker {...props} />

const StyledInput = styled(DatePickerWrapper)`
  width: 240px;
  height: ${INPUT_HEIGHT};
  padding: 0 16px;
  border-radius: 8px;
  border-color: ${props => props.theme.colors.themeColorLight};
  border-width: 3px;
  border-style: solid;

  &&& {
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.themeColor};
    }
  }
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
  try {
    const checkDate = DateTime.fromJSDate(date)
    const maxValidYear = 2500
    // Added this operator to prevent crashing rrule when typing random number
    return checkDate.year <= maxValidYear
  } catch (_) {
    return false
  }
}
const containsOnlyDigits = (str: string) => !Number.isNaN(Number(str))

const CustomDatePicker = ({
  title,
  date,
  setDate,
  error,
  placeholderDate,
  calendarLabel,
}: CustomDatePickerProps): ReactElement => {
  const { t } = useTranslation('events')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [datePickerError, setDatePickerError] = useState('')
  const [value, setValue] = useState('')
  const maxInputLength = 10

  const handleDateChange = (date: Date | null) => {
    if (isValidJsDate(date)) {
      setDate(DateTime.fromJSDate(date ?? new Date()))
    } else if (value.length < maxInputLength) {
      setDatePickerError(t('invalidDate'))
    }
  }
  const handleDateError = (date: string) => {
    if (!containsOnlyDigits(date.replace('.', '')) || date.length > maxInputLength) {
      return
    }
    setValue(date)
    const errorString = 'unit out of range'
    setDatePickerError('')
    try {
      DateTime.fromFormat(date, 'dd.MM.yyyy')
    } catch (e) {
      if (e instanceof Error && String(e.message).includes(errorString)) {
        setDatePickerError(t('outOfRangeError'))
      }
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
      <StyledInputWrapper>
        <StyledInput
          open={isCalendarOpen}
          value={value}
          popperPlacement='bottom'
          selected={isValidJsDate(date?.toJSDate() ?? null) ? date?.toJSDate() : null}
          onSelect={e => {
            setValue(DateTime.fromJSDate(e ?? new Date()).toFormat('dd.MM.yyyy'))
            setDatePickerError('')
          }}
          onClickOutside={() => setIsCalendarOpen(false)}
          calendarClassName='calenderStyle'
          dateFormat='dd.MM.yyyy'
          placeholderText={placeholderDate.toFormat('dd.MM.yyyy')}
          onChange={(date: Date | null) => handleDateChange(date)}
          onChangeRaw={e => handleDateError(String((e?.target as HTMLInputElement).value))}
        />
        <StyledIconButton
          ariaLabel={calendarLabel}
          isCalendarOpen={isCalendarOpen}
          onClick={() => setIsCalendarOpen(true)}
          icon={EventIcon}
        />
      </StyledInputWrapper>
      <StyledTitle>{title}</StyledTitle>
      {!!(error || datePickerError) && <StyledError>{error || datePickerError}</StyledError>}
    </DateContainer>
  )
}

export default CustomDatePicker
