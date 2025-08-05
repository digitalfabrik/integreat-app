import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
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

    const { getByText, getByPlaceholderText } = renderCustomDatePicker({
      title,
      date,
      setDate,
      error: '',
      placeholderDate,
      calendarLabel: 'calendar',
    })

    expect(getByText(title)).toBeInTheDocument()
    expect(getByPlaceholderText('08.04.2025')).toBeInTheDocument()
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
