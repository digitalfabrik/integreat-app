import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { INPUT_DATE_FORMAT } from 'shared/constants'

import { CalendarTodayIcon } from '../assets'
import dimensions from '../constants/dimensions'

const DateContainer = styled.div`
  width: fit-content;
  position: relative;
`
const StyledInput = styled.input`
  min-width: 316px;
  height: 56px;
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
    min-width: 240px;
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
  font-weight: 400;
`
const StyledError = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.invalidInput};
`
export type DatePickerProps = {
  title: string
  value?: DateTime | null
  setValue: (fromDate: DateTime | null) => void
  error?: string
}
const DatePicker = ({ title, value, setValue, error }: DatePickerProps): ReactElement => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setValue(DateTime.fromFormat(event.target.value, INPUT_DATE_FORMAT).toLocal())
    } catch (e) {
      setValue(null)
    }
  }
  return (
    <DateContainer>
      <StyledTitle>{title}</StyledTitle>
      <StyledInput
        alt='Date-input'
        type='date'
        value={value?.toFormat(INPUT_DATE_FORMAT)}
        onChange={handleDateChange}
      />
      {!!error && <StyledError>{error}</StyledError>}
    </DateContainer>
  )
}

export default DatePicker
