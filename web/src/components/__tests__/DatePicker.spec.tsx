import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { EVENTS_ROUTE } from 'shared'

import { RoutePatterns } from '../../routes'
import { renderRoute } from '../../testing/render'
import CustomAdapterLuxon from '../../utils/CustomAdapterLuxon'
import DatePicker, { CustomDatePickerProps } from '../DatePicker'

jest.mock('react-i18next')

describe('DatePicker', () => {
  const setDate = jest.fn()
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[EVENTS_ROUTE]}`
  const pathname = '/augsburg/de/events'

  const renderCustomDatePicker = ({ setDate, title, date, error }: CustomDatePickerProps) =>
    renderRoute(
      <LocalizationProvider dateAdapter={CustomAdapterLuxon} adapterLocale='de'>
        <DatePicker setDate={setDate} title={title} date={date} error={error} calendarLabel='calendar' />
      </LocalizationProvider>,
      { pathname, routePattern },
    )

  it('renders correctly with given props', () => {
    const title = 'From Date'
    const date = DateTime.now()

    const { getAllByLabelText } = renderCustomDatePicker({
      title,
      date,
      setDate,
      error: '',
      calendarLabel: 'calendar',
    })

    expect(getAllByLabelText(title)).toHaveLength(2)
  })

  it('handles date change correctly', () => {
    const currentDate = DateTime.local(2025, 9, 15)
    const newValue = DateTime.local(2025, 9, 20).setLocale('de')

    const { getByLabelText, getByText } = renderCustomDatePicker({
      title: 'From Date',
      date: currentDate,
      setDate,
      error: '',
      calendarLabel: 'calendar',
    })
    fireEvent.click(getByLabelText('calendar'))
    fireEvent.click(getByText(newValue.day))

    expect(setDate).toHaveBeenCalledWith(newValue, { validationError: null })
  })

  it('displays an error message when error prop is provided', () => {
    const error = 'Invalid date'

    const { getByText } = renderCustomDatePicker({
      title: 'From Date',
      date: DateTime.local(),
      setDate,
      error,
      calendarLabel: 'calendar',
    })

    expect(getByText(error)).toBeInTheDocument()
  })
})
