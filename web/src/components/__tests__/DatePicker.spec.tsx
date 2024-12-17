import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import DatePicker, { CustomDatePickerProps } from '../DatePicker'

describe('DatePicker', () => {
  const setDate = jest.fn()

  const renderCustomDatePicker = ({ setDate, title, date, error }: CustomDatePickerProps) =>
    renderWithTheme(<DatePicker setDate={setDate} title={title} date={date} error={error} />)

  it('renders correctly with given props', () => {
    const title = 'From Date'
    const date = DateTime.now()

    const { getByText, getByPlaceholderText } = renderCustomDatePicker({
      title,
      date,
      setDate,
      error: '',
    })

    expect(getByText(title)).toBeInTheDocument()
    expect(getByPlaceholderText('01.01.1990')).toBeInTheDocument()
  })

  it('handles date change correctly', () => {
    const newValue = DateTime.now().plus({ days: 1 })

    const { getByPlaceholderText } = renderCustomDatePicker({
      title: 'From Date',
      date: DateTime.local(),
      setDate,
      error: '',
    })

    const input = getByPlaceholderText('01.01.1990')

    fireEvent.change(input, { target: { value: newValue } })

    expect(setDate).toHaveBeenCalledWith(newValue)
  })

  it('displays an error message when error prop is provided', () => {
    const error = 'Invalid date'

    const { getByText } = renderCustomDatePicker({
      title: 'From Date',
      date: DateTime.local(),
      setDate,
      error,
    })

    expect(getByText(error)).toBeInTheDocument()
  })
})
