import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import DatesPageDetail from '../DatesPageDetail'

jest.mock('react-i18next')

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('DatesPageDetail', () => {
  const renderDatesPageDetail = (date: DateModel) => renderWithTheme(<DatesPageDetail date={date} />)
  const date = (rrule?: string) =>
    new DateModel({
      startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00', { locale: 'de' }),
      endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00', { locale: 'de' }),
      allDay: false,
      recurrenceRule: rrule ? rrulestr(rrule) : null,
      onlyWeekdays: false,
    })

  it('should render the date without week day if no recurrences', () => {
    const { getByText, queryByRole, queryByText } = renderDatesPageDetail(date())

    expect(getByText('9.–10. Oktober 2023')).toBeTruthy()
    expect(queryByText('Montag, Dienstag')).toBeFalsy()
    expect(getByText('07:00–09:00 Uhr')).toBeTruthy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render the date with week day for a weekly recurring event', () => {
    const { getByText, queryByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000'),
    )

    expect(getByText('9.–23. Oktober 2023')).toBeTruthy()
    expect(getByText('Montag')).toBeTruthy()
    expect(getByText('07:00–09:00 Uhr')).toBeTruthy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render the next dates and show collapsible for a monthly recurring event', () => {
    const { getAllByText, getByText, queryByText, getByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=MO'),
    )

    expect(getByText('Montag, 9. Oktober 2023')).toBeTruthy()
    expect(getAllByText('07:00–09:00 Uhr')).toHaveLength(10)
    expect(queryByText('Montag, 12. Februar 2024')).toBeFalsy()

    expect(getByRole('button')).toBeTruthy()
    fireEvent.click(getByRole('button'))

    expect(getAllByText('07:00–09:00 Uhr')).toHaveLength(20)
    expect(getByText('Montag, 12. Februar 2024')).toBeTruthy()
  })
})
