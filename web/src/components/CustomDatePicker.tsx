import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CalendarEventsIcon } from '../assets'
import dimensions from '../constants/dimensions'

const DateContainer = styled.div`
  width: fit-content;
  position: relative;
`
const StyledInput = styled.input`
  min-width: 316px;
  height: 56px;
  padding: 0 8px;
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
      background: url(${CalendarEventsIcon}) no-repeat center center;
      background-size: 55px;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      cursor: pointer;
      background-color: #e9e8e9;
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
  left: ${props => (props.theme.contentDirection === 'rtl' ? 'auto' : '10px')};
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
type CustomDatePickerProps = {
  title: string
  value?: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  error?: string
}
const CustomDatePicker = ({ title, value, setValue, error }: CustomDatePickerProps): ReactElement => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <DateContainer>
      <StyledTitle>{title}</StyledTitle>
      <StyledInput alt='Date-input' type='date' value={value} onChange={handleDateChange} />
      {!!error && <StyledError>{error}</StyledError>}
    </DateContainer>
  )
}

export default CustomDatePicker
