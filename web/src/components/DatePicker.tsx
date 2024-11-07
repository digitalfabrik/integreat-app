import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CalendarTodayIcon } from '../assets'
import dimensions from '../constants/dimensions'

const INPUT_MIN_WIDTH = '316px'
const INPUT_HEIGHT = '56px'
const INPUT_MIN_WIDTH_ON_MID_VIEWPORT = '240px'

const DateContainer = styled.div`
  width: fit-content;
  position: relative;
`

const StyledInput = styled.input`
  min-width: ${INPUT_MIN_WIDTH};
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

    &::-webkit-calendar-picker-indicator {
      background: url(${CalendarTodayIcon}) no-repeat center center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      background-color: ${props => props.theme.colors.textDisabledColor};
    }

    &:focus::-webkit-calendar-picker-indicator {
      background-color: ${props => props.theme.colors.themeColorLight};
    }
  }

  @media ${dimensions.mediumViewport} {
    min-width: ${INPUT_MIN_WIDTH_ON_MID_VIEWPORT};
  }
`

const StyledTitle = styled.span`
  background-color: ${props => props.theme.colors.backgroundColor};
  position: absolute;
  top: -12px;
  left: ${props => (props.theme.contentDirection === 'rtl' ? 'auto' : '12px')};
  right: ${props => (props.theme.contentDirection === 'rtl' ? '12px' : 'auto')};
  padding: 2px 5px;
  font-size: 12px;
`

const StyledError = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.invalidInput};
`

export type DatePickerProps = {
  title: string
  date?: DateTime | null
  setDate: (date: DateTime | null) => void
  error?: string
}

const isValidIsoDate = (date: string): boolean => {
  try {
    DateTime.fromISO(date)
    return true
  } catch (_) {
    return false
  }
}

const DatePicker = ({ title, date, setDate, error }: DatePickerProps): ReactElement => {
  const { t } = useTranslation('events')
  const [tempDate, setTempDate] = useState(date?.toISODate() ?? '')
  const isInvalidDate = tempDate !== '' && isValidIsoDate(tempDate) === false
  const shownError = error || (isInvalidDate ? t('invalidToDate') : undefined)
  useEffect(() => {
    setTempDate(date?.toISODate() ?? '')
  }, [date])

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(event.target.value)
    try {
      setDate(DateTime.fromISO(event.target.value))
    } catch (_) {
      // Invalid date format, do not update the state
    }
  }

  return (
    <DateContainer>
      <StyledTitle>{title}</StyledTitle>
      <StyledInput
        placeholder={DateTime.now().toLocaleString()}
        type='date'
        value={tempDate}
        onChange={handleDateChange}
      />
      {!!shownError && <StyledError>{shownError}</StyledError>}
    </DateContainer>
  )
}

export default DatePicker
