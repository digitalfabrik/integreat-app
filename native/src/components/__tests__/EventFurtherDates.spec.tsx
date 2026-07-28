import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel } from 'shared/api'

import render from '../../testing/render'
import EventFurtherDates from '../EventFurtherDates'

jest.mock('react-i18next')

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('EventFurtherDates', () => {
  const date = (rrule?: string) =>
    new DateModel({
      startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
      endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
      allDay: false,
      recurrenceRule: rrule ? rrulestr(rrule) : null,
      onlyWeekdays: false,
    })

  it('should render nothing for a weekly recurring event', () => {
    const { queryByText } = render(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')} language='de' />,
    )

    expect(queryByText('furtherDates')).toBeFalsy()
  })

  it('should reveal the upcoming dates when expanding a monthly recurring event', () => {
    const { getByText, queryByText } = render(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')} language='de' />,
    )

    expect(getByText('furtherDates')).toBeTruthy()
    expect(queryByText('13. Nov. 2023 · 7:00 - 9:00')).toBeFalsy()

    fireEvent.press(getByText('furtherDates'))

    expect(getByText('13. Nov. 2023 · 7:00 - 9:00')).toBeTruthy()
    expect(queryByText('9. Okt. 2023 · 7:00 - 9:00')).toBeFalsy()
    expect(getByText('11. Dez. 2023 · 7:00 - 9:00')).toBeTruthy()
    expect(getByText('11. März 2024 · 7:00 - 9:00 …')).toBeTruthy()
  })
})
