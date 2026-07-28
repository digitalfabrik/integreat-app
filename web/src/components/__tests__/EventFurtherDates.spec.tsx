import { fireEvent, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
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
    const { queryByText } = renderWithTheme(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')} languageCode='de' />,
    )

    expect(queryByText('events:furtherDates')).toBeFalsy()
  })

  it('should reveal the upcoming dates when expanding a monthly recurring event', async () => {
    const { getByRole, getByText, queryByText } = renderWithTheme(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')} languageCode='de' />,
    )

    expect(getByText('events:furtherDates')).toBeTruthy()
    const collapsedDate = queryByText('13. Nov. 2023 · 7:00 - 9:00')
    if (collapsedDate) {
      expect(collapsedDate).not.toBeVisible()
    }

    fireEvent.click(getByRole('button'))

    await waitFor(() => expect(getByText('13. Nov. 2023 · 7:00 - 9:00')).toBeVisible())
    expect(queryByText('9. Okt. 2023 · 7:00 - 9:00')).toBeFalsy()
    expect(getByText('11. Dez. 2023 · 7:00 - 9:00')).toBeVisible()
    expect(getByText('11. März 2024 · 7:00 - 9:00 …')).toBeVisible()
  })
})
