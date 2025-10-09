import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import DatesPageDetail from '../DatesPageDetail'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      options
        ? `${key}, ${Object.entries(options)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}`
        : key,
  }),
}))

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('DatesPageDetail', () => {
  const renderDatesPageDetail = (date: DateModel) => renderWithTheme(<DatesPageDetail date={date} language='de' />)
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

    expect(getByText('9. Oktober 2023 - 10. Oktober 2023')).toBeTruthy()
    expect(queryByText('Montag, Dienstag')).toBeFalsy()
    expect(getByText('timeRange, startTime: 7:00, endTime: 9:00')).toBeTruthy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render the date with week day for a weekly recurring event', () => {
    const { getByText, queryByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000'),
    )

    expect(getByText('9. Oktober 2023 - 23. Oktober 2023')).toBeTruthy()
    expect(getByText('Montag')).toBeTruthy()
    expect(getByText('timeRange, startTime: 7:00, endTime: 9:00')).toBeTruthy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render the next dates and show collapsible for a monthly recurring event', () => {
    const { getAllByText, getByText, queryByText, getByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO'),
    )

    expect(getByText('Montag, 9. Oktober 2023')).toBeTruthy()
    expect(getAllByText('timeRange, startTime: 7:00, endTime: 9:00')).toHaveLength(MAX_DATE_RECURRENCES)
    expect(queryByText('Montag, 12. Februar 2024')).toBeFalsy()

    expect(getByRole('button')).toBeTruthy()
    fireEvent.click(getByRole('button'))

    expect(getAllByText('timeRange, startTime: 7:00, endTime: 9:00')).toHaveLength(2 * MAX_DATE_RECURRENCES)
    expect(getByText('Montag, 12. Februar 2024')).toBeTruthy()
  })
})
