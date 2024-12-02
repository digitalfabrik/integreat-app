import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

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

  it('should update the date correctly', () => {
    const { getAllByPlaceholderText, getByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: DateTime.now(),
      error: '',
    })

    const dayMonthInput = getAllByPlaceholderText('01')
    const yearInput = getByPlaceholderText('1990')

    fireEvent.changeText(dayMonthInput[0] as ReactTestInstance, '15')
    fireEvent.changeText(dayMonthInput[1] as ReactTestInstance, '08')
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
    const { getAllByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
    })

    const dayInput = getAllByPlaceholderText('01')[0] as ReactTestInstance

    fireEvent.changeText(dayInput, '32')
    fireEvent(dayInput, 'blur')
    expect(dayInput.props.value).toBe(DateTime.now().toFormat('dd'))
  })

  it('should not allow month greater than 12', () => {
    const { getAllByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
    })

    const monthInput = getAllByPlaceholderText('01')[1] as ReactTestInstance

    fireEvent.changeText(monthInput, '13')
    fireEvent(monthInput, 'blur')
    expect(monthInput.props.value).toBe(DateTime.now().toFormat('MM'))
  })

  it('should format the day with leading zero on blur', () => {
    const { getAllByPlaceholderText } = renderCustomDatePicker({
      modalOpen: false,
      setModalOpen,
      setDate,
      title: 'Test DatePicker',
      date: null,
      error: '',
    })

    const dayInput = getAllByPlaceholderText('01')[0] as ReactTestInstance

    fireEvent.changeText(dayInput, '5')
    fireEvent(dayInput, 'blur')

    expect(dayInput.props.value).toBe('05')
  })
})
