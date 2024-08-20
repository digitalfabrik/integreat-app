import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CalendarEventsIcon } from '../assets'

const DateContainer = styled.div`
  width: fit-content;
  position: relative;
`
const StyledInput = styled.input`
  width: 315px;
  height: 55px;
  padding: 0 15px;
  border-radius: 7px;
  border-color: ${props => props.theme.colors.themeColor};
  border-width: 3px;
  border-style: solid;

  &&& {
    &:focus {
      outline: none;
    }

    &::-webkit-calendar-picker-indicator {
      background: url(${CalendarEventsIcon}) no-repeat;
      background-size: contain;
      transform: scale(2);
      color: gray;
    }
  }
`
const StyledTitle = styled.span`
  background-color: ${props => props.theme.colors.backgroundColor};
  position: absolute;
  top: -12px;
  left: 10px;
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
      <StyledInput type='date' value={value} onChange={handleDateChange} />
      {!!error && <StyledError>{error}</StyledError>}
    </DateContainer>
  )
}

export default CustomDatePicker
