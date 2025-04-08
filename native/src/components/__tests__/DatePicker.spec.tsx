import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import renderWithTheme from '../../testing/render'
import DatePicker, { DatePickerProps } from '../DatePicker'

jest.mock('react-i18next')

describe('DatePickerForNative', () => {
  const setDate = jest.fn()
  const setModalOpen = jest.fn()

  const renderCustomDatePicker = ({
    modalOpen,
    setModalOpen,
    setDate,
    title,
    date,
    error,
    placeholderDate,
  }: DatePickerProps) =>
    renderWithTheme(
      <DatePicker
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setDate={setDate}
        title={title}
        date={date}
        error={error}
        placeholderDate={placeholderDate}
      />,
    )

  it('should render the given props correctly', () => {
    const { getByText, getByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: DateTime.now(),
      error: '',
      placeholderDate: DateTime.fromISO('1999-01-09'),
    })
    console.log(new Date('1999-01-09'))
    expect(getByPlaceholderText('01')).toBeTruthy()
    expect(getByPlaceholderText('09')).toBeTruthy()
    expect(getByPlaceholderText('1999')).toBeTruthy()
    expect(getByText('Test DatePicker')).toBeTruthy()
  })

  it('should update the date correctly', () => {
    const { getAllByPlaceholderText, getByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: DateTime.now(),
      error: '',
      placeholderDate: DateTime.fromISO('1990-01-01'),
    })

    const dayMonthInput = getAllByPlaceholderText('01')
    const yearInput = getByPlaceholderText('1990')
    expect(dayMonthInput.length).toBeGreaterThanOrEqual(2)

    fireEvent.changeText(dayMonthInput[0]!, '15')
    fireEvent.changeText(dayMonthInput[1]!, '08')
    fireEvent.changeText(yearInput, '2024')

    expect(setDate).toHaveBeenCalledWith(DateTime.fromFormat('15/08/2024', 'dd/MM/yyyy'))
  })

  it('should show errors correctly', () => {
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

  it('should not allow day greater than 31', () => {
    const { getAllByPlaceholderText, getByDisplayValue } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
      placeholderDate: DateTime.fromISO('1990-01-01'),
    })

    const dayInputs = getAllByPlaceholderText('01')
    expect(dayInputs.length).toBeGreaterThan(0)

    const dayInput = dayInputs[0]!

    fireEvent.changeText(dayInput, '32')
    fireEvent(dayInput, 'blur')
    expect(getByDisplayValue(DateTime.now().toFormat('dd'))).toBeTruthy()
  })

  it('should not allow month greater than 12', () => {
    const { getAllByPlaceholderText, getByDisplayValue } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
      placeholderDate: DateTime.fromISO('1990-01-01'),
    })

    const monthInputs = getAllByPlaceholderText('01')
    expect(monthInputs.length).toBeGreaterThan(1)

    const monthInput = monthInputs[1]!

    fireEvent.changeText(monthInput, '13')
    fireEvent(monthInput, 'blur')
    expect(getByDisplayValue(DateTime.now().toFormat('MM'))).toBeTruthy()
  })

  it('should format the day with leading zero on blur', () => {
    const { getAllByPlaceholderText, getByDisplayValue } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
      placeholderDate: DateTime.fromISO('1990-01-01'),
    })

    const dayInputs = getAllByPlaceholderText('01')
    expect(dayInputs.length).toBeGreaterThan(0)

    const dayInput = dayInputs[0]!

    fireEvent.changeText(dayInput, '5')
    fireEvent(dayInput, 'blur')
    expect(getByDisplayValue('05')).toBeTruthy()
  })
})
