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

  it('should render nothing for a non-recurring event', () => {
    const { queryByText } = render(<EventFurtherDates date={date()} language='de' />)

    expect(queryByText('furtherDates')).toBeFalsy()
  })

  it('should reveal the upcoming dates when expanding a monthly recurring event', () => {
    const { getByText, queryByText } = render(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')} language='de' />,
    )

    expect(getByText('furtherDates')).toBeTruthy()
    expect(queryByText('13. Nov. 2023')).toBeFalsy()

    fireEvent.press(getByText('furtherDates'))

    expect(getByText('13. Nov. 2023')).toBeTruthy()
    expect(queryByText('9. Okt. 2023')).toBeFalsy()
    expect(getByText('11. Dez. 2023')).toBeTruthy()
    expect(getByText('8. Jan. 2024')).toBeTruthy()
    expect(queryByText('12. Feb. 2024')).toBeFalsy()
    expect(queryByText('7:00 - 9:00')).toBeFalsy()
    expect(getByText('…')).toBeTruthy()
  })

  it('should reveal the upcoming dates when expanding a weekly recurring event', () => {
    const { getByText, queryByText } = render(
      <EventFurtherDates date={date('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')} language='de' />,
    )

    fireEvent.press(getByText('furtherDates'))

    expect(getByText('16. Okt. 2023')).toBeTruthy()
    expect(getByText('23. Okt. 2023')).toBeTruthy()
    expect(queryByText('7:00 - 9:00')).toBeFalsy()
    expect(getByText('…')).toBeTruthy()
  })

  it('should show the time if it differs between the dates', () => {
    const { getByText } = render(
      <EventFurtherDates
        date={date('DTSTART:20231016T050000\nRDATE:20231016T050000\nRDATE:20231018T090000\nRDATE:20231020T130000')}
        language='de'
      />,
    )

    fireEvent.press(getByText('furtherDates'))

    expect(getByText('18. Okt. 2023')).toBeTruthy()
    expect(getByText('9:00 - 11:00')).toBeTruthy()
    expect(getByText('20. Okt. 2023')).toBeTruthy()
    expect(getByText('13:00 - 15:00')).toBeTruthy()
  })
})
