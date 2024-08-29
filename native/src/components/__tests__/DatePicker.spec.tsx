import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import renderWithTheme from '../../testing/render'
import DatePicker, { DatePickerProps } from '../DatePicker'

describe('DatePickerForNative', () => {
  const setValue = jest.fn()
  const setModalState = jest.fn()

  const renderCustomDatePicker = ({ modalState, setModalState, setValue, title, value, error }: DatePickerProps) =>
    renderWithTheme(
      <DatePicker
        modalState={modalState}
        setModalState={setModalState}
        setValue={setValue}
        title={title}
        value={value}
        error={error}
      />,
    )

  it('renders correctly with given props', () => {
    const { getByText } = renderCustomDatePicker({
      modalState: false,
      setModalState,
      setValue,
      title: 'Test DatePicker',
      value: DateTime.local(),
      error: '',
    })

    expect(getByText('Test DatePicker')).toBeTruthy()
  })

  it('updates date state and calls setValue with correct date', () => {
    const { getByTestId } = renderCustomDatePicker({
      modalState: false,
      setModalState,
      setValue,
      title: 'Test DatePicker',
      value: DateTime.local(),
      error: '',
    })

    const dayInput = getByTestId('DatePicker-day')
    const monthInput = getByTestId('DatePicker-month')
    const yearInput = getByTestId('DatePicker-year')

    fireEvent.changeText(dayInput, '15')
    fireEvent.changeText(monthInput, '08')
    fireEvent.changeText(yearInput, '2024')

    expect(setValue).toHaveBeenCalledWith(DateTime.fromFormat('15/08/2024', 'dd/MM/yyyy').toLocal())
  })

  it('handles errors gracefully', () => {
    const { getByText } = renderCustomDatePicker({
      modalState: false,
      setModalState,
      setValue,
      title: 'Test DatePicker',
      value: null,
      error: 'Invalid date',
    })

    expect(getByText('Invalid date')).toBeTruthy()
  })
})
