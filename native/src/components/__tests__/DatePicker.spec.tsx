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

  it('should render the given props correctly', () => {
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

  it('should update date state and calls setValue with correct date', () => {
    const { getByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: DateTime.now(),
      error: '',
    })

    const dayInput = getByPlaceholderText('dd')
    const monthInput = getByPlaceholderText('mm')
    const yearInput = getByPlaceholderText('yyyy')

    fireEvent.changeText(dayInput, '15')
    fireEvent.changeText(monthInput, '08')
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
    const { getByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
    })

    const dayInput = getByPlaceholderText('dd')

    fireEvent.changeText(dayInput, '32')
    expect(dayInput.props.value).toBe('')
  })

  it('should not allow month greater than 12', () => {
    const { getByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
    })

    const monthInput = getByPlaceholderText('mm')

    fireEvent.changeText(monthInput, '13')
    expect(monthInput.props.value).toBe('')
  })

  it('should format the day with leading zero on blur', () => {
    const { getByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
    })

    const dayInput = getByPlaceholderText('dd')

    fireEvent.changeText(dayInput, '5')
    fireEvent(dayInput, 'blur')

    expect(dayInput.props.value).toBe('05')
  })
})
