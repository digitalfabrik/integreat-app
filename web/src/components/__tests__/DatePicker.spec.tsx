import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import DatePicker, { DatePickerProps } from '../DatePicker'

describe('DatePicker', () => {
  const setValue = jest.fn()

  const renderCustomDatePicker = ({ setValue, title, value, error }: DatePickerProps) =>
    renderWithTheme(<DatePicker setValue={setValue} title={title} value={value} error={error} />)

  it('renders correctly with given props', () => {
    const title = 'From Date'
    const value = DateTime.local()

    const { getByText, getByAltText } = renderCustomDatePicker({
      title,
      value,
      setValue,
      error: '',
    })

    expect(getByText(title)).toBeInTheDocument()
    expect(getByAltText('Date-input')).toHaveValue(value.toFormat('yyyy-MM-dd'))
  })

  it('handles date change correctly', () => {
    const newValue = DateTime.local().plus({ days: 1 }).toFormat('yyyy-MM-dd')

    const { getByAltText } = renderCustomDatePicker({
      title: 'From Date',
      value: DateTime.local(),
      setValue,
      error: '',
    })

    const input = getByAltText('Date-input')
    fireEvent.change(input, { target: { value: newValue } })

    expect(setValue).toHaveBeenCalledWith(DateTime.fromFormat(newValue, 'yyyy-MM-dd').toLocal())
  })

  it('displays an error message when error prop is provided', () => {
    const error = 'Invalid date'

    const { getByText } = renderCustomDatePicker({
      title: 'From Date',
      value: DateTime.local(),
      setValue,
      error,
    })

    expect(getByText(error)).toBeInTheDocument()
  })
})
