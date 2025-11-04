import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { MAX_DATE_RECURRENCES } from 'shared'
import { DateModel } from 'shared/api'

import render from '../../testing/render'
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
  const renderDatesPageDetail = (date: DateModel) => render(<DatesPageDetail date={date} languageCode='de' />)

  const date = (rrule?: string) =>
    new DateModel({
      startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
      endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
      allDay: false,
      recurrenceRule: rrule ? rrulestr(rrule) : null,
      onlyWeekdays: false,
    })

  it('should render the date if there are no recurrences', () => {
    const { getByText, queryByRole } = renderDatesPageDetail(date())

    expect(getByText('9. Oktober 2023 - 10. Oktober 2023')).toBeTruthy()
    expect(getByText('7:00 - 9:00')).toBeTruthy()
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render only next dates if up to MAX_DATE_RECURRENCES monthly recurring events', () => {
    const { getAllByText, getByText, queryByRole } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+1MO;UNTIL=20231229T050000'),
    )

    expect(getByText('Montag, 6. November 2023')).toBeTruthy()
    expect(getByText('Montag, 4. Dezember 2023')).toBeTruthy()
    expect(getAllByText('7:00 - 9:00')).toHaveLength(2)
    expect(queryByRole('button')).toBeFalsy()
  })

  it('should render next dates and show collapsible if more than MAX_DATE_RECURRENCES monthly recurring events and expand on press', () => {
    const { getAllByText, getByText, queryByText } = renderDatesPageDetail(
      date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+1MO'),
    )

    expect(getByText('Montag, 6. November 2023')).toBeTruthy()
    expect(getByText('Montag, 4. Dezember 2023')).toBeTruthy()
    expect(getByText('Montag, 1. Januar 2024')).toBeTruthy()
    expect(queryByText('Montag, 5. Februar 2024')).toBeFalsy()
    expect(queryByText('Montag, 4. März 2024')).toBeFalsy()
    expect(queryByText('Montag, 1. April 2024')).toBeFalsy()
    expect(getAllByText('7:00 - 9:00')).toHaveLength(MAX_DATE_RECURRENCES)

    expect(getByText('common:showMore')).toBeTruthy()
    fireEvent.press(getByText('common:showMore'))

    expect(getByText('Montag, 5. Februar 2024')).toBeTruthy()
    expect(getByText('Montag, 4. März 2024')).toBeTruthy()
    expect(getByText('Montag, 1. April 2024')).toBeTruthy()
    expect(getAllByText('7:00 - 9:00')).toHaveLength(2 * MAX_DATE_RECURRENCES)
  })
})
