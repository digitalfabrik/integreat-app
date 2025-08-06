import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import useCityContentParams from '../../hooks/useCityContentParams'
import { renderWithTheme } from '../../testing/render'
import DatePicker, { CustomAdapterLuxon, CustomDatePickerProps } from '../DatePicker'

jest.mock('react-i18next')
jest.mock('../../hooks/useCityContentParams')

const mockedUseCityContentParams = useCityContentParams as jest.MockedFunction<typeof useCityContentParams>
describe('DatePicker', () => {
  const setDate = jest.fn()
  beforeEach(() => {
    mockedUseCityContentParams.mockReturnValue({
      cityCode: 'city',
      languageCode: 'de',
    })
  })

  const renderCustomDatePicker = ({ setDate, title, date, error, placeholderDate }: CustomDatePickerProps) =>
    renderWithTheme(
      <LocalizationProvider dateAdapter={CustomAdapterLuxon} adapterLocale='de'>
        <DatePicker
          setDate={setDate}
          title={title}
          date={date}
          error={error}
          placeholderDate={placeholderDate}
          calendarLabel='calendar'
        />
      </LocalizationProvider>,
    )

  it('renders correctly with given props', () => {
    const title = 'From Date'
    const date = DateTime.now()

    const placeholderDate = DateTime.fromISO('2025-04-08')

    const { getByLabelText, getByPlaceholderText } = renderCustomDatePicker({
      title,
      date,
      setDate,
      error: '',
      placeholderDate,
      calendarLabel: 'calendar',
    })

    expect(getByLabelText(title)).toBeInTheDocument()
    expect(getByPlaceholderText('08.04.2025')).toBeInTheDocument()
  })

  it('handles date change correctly', () => {
    const currentDate = DateTime.local()
    const newValue = DateTime.now().plus({ days: 1 }).setLocale('de')
    const placeholderDate = DateTime.now()
    const ariaLabel = `Choose date, selected date is ${currentDate.toLocaleString({ day: 'numeric', month: 'short', year: 'numeric' }, { locale: 'de' })}`

    const { getByLabelText, getByText } = renderCustomDatePicker({
      title: 'From Date',
      date: currentDate,
      setDate,
      error: '',
      placeholderDate,
      calendarLabel: 'calendar',
    })
    fireEvent.click(getByLabelText(ariaLabel))
    fireEvent.click(getByText(newValue.day))

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
      calendarLabel: 'calendar',
    })

    expect(getByText(error)).toBeInTheDocument()
  })
})
