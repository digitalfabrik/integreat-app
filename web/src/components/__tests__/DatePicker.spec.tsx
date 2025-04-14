import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import DatePicker, { CustomDatePickerProps } from '../DatePicker'

jest.mock('react-i18next')

describe('DatePicker', () => {
  const setDate = jest.fn()

  const renderCustomDatePicker = ({ setDate, title, date, error, placeholderDate }: CustomDatePickerProps) =>
    renderWithTheme(
      <DatePicker setDate={setDate} title={title} date={date} error={error} placeholderDate={placeholderDate} />,
    )

  it('renders correctly with given props', () => {
    const title = 'From Date'
    const date = DateTime.now()

    const placeholderDate = DateTime.fromISO('2025-04-08')

    const { getByText, getByPlaceholderText } = renderCustomDatePicker({
      title,
      date,
      setDate,
      error: '',
      placeholderDate,
    })

    expect(getByText(title)).toBeInTheDocument()
    expect(getByPlaceholderText('08.04.2025')).toBeInTheDocument()
  })

  it('handles date change correctly', () => {
    const newValue = DateTime.now().plus({ days: 1 })
    const today = new Date()
    const placeholderDate = DateTime.now()

    const { getByPlaceholderText } = renderCustomDatePicker({
      title: 'From Date',
      date: DateTime.local(),
      setDate,
      error: '',
      placeholderDate,
    })

    const input = getByPlaceholderText(DateTime.fromJSDate(today).toFormat('dd.MM.yyyy'))

    fireEvent.change(input, { target: { value: newValue } })

    expect(setDate).toHaveBeenCalledWith(newValue)
  })

  it('displays an error message when error prop is provided', () => {
    const error = 'Invalid date'
    const placeholderDate = DateTime.now()

    const { getByText } = renderCustomDatePicker({
      title: 'From Date',
      date: DateTime.local(),
      setDate,
      error,
      placeholderDate,
    })

    expect(getByText(error)).toBeInTheDocument()
  })
})
