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

  const renderCustomDatePicker = ({ setDate, title, date, error, placeholderDate }: CustomDatePickerProps) =>
    renderRoute(
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
      { pathname, routePattern },
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
    const currentDate = DateTime.local(2025, 9, 15)
    const newValue = DateTime.local(2025, 9, 20).setLocale('de')
    const ariaLabel = `Datum auswählen, gewähltes Datum ist ${currentDate.toLocaleString({ day: 'numeric', month: 'short', year: 'numeric' }, { locale: 'de' })}`

    const { getByLabelText, getByText } = renderCustomDatePicker({
      title: 'From Date',
      date: currentDate,
      setDate,
      error: '',
      placeholderDate: currentDate,
      calendarLabel: 'calendar',
    })
    fireEvent.click(getByLabelText(ariaLabel))
    fireEvent.click(getByText(newValue.day))

    expect(setDate).toHaveBeenCalledWith(newValue, { validationError: null })
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
