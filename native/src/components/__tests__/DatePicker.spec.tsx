import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import renderWithTheme from '../../testing/render'
import DatePicker, { DatePickerProps } from '../DatePicker'

describe('DatePickerForNative', () => {
  const setDate = jest.fn()
  const setModalOpen = jest.fn()

  const renderCustomDatePicker = ({ modalOpen, setModalOpen, setDate, title, date, error }: DatePickerProps) =>
    renderWithTheme(
      <DatePicker
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setDate={setDate}
        title={title}
        date={date}
        error={error}
      />,
    )

  it('renders correctly with given props', () => {
    const { getByText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: DateTime.now(),
      error: '',
    })

    expect(getByText('Test DatePicker')).toBeTruthy()
  })

  it('updates date state and calls setValue with correct date', () => {
    const { getByTestId } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: DateTime.now(),
      error: '',
    })

    const dayInput = getByTestId('DatePicker-day')
    const monthInput = getByTestId('DatePicker-month')
    const yearInput = getByTestId('DatePicker-year')

    fireEvent.changeText(dayInput, '15')
    fireEvent.changeText(monthInput, '08')
    fireEvent.changeText(yearInput, '2024')

    expect(setDate).toHaveBeenCalledWith(DateTime.fromFormat('15/08/2024', 'dd/MM/yyyy'))
  })

  it('handles errors gracefully', () => {
    const { getByText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: 'Invalid date',
    })

    expect(getByText('Invalid date')).toBeTruthy()
  })
})
