import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel, EventModelBuilder } from 'shared/api'

import render from '../../testing/render'
import EventDates from '../EventDates'

jest.useFakeTimers({ now: new Date('2023-10-09T15:23:57.443+02:00') })
describe('EventDates', () => {
  const language = 'de'
  const baseEvent = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!

  const eventWithDate = (rrule?: string) =>
    Object.assign(baseEvent, {
      _date: new DateModel({
        startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
        endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
        allDay: false,
        recurrenceRule: rrule ? rrulestr(rrule) : null,
        onlyWeekdays: false,
      }),
    })

  it('should render the upcoming date row for a non-recurring event', () => {
    const event = eventWithDate()
    const { getByText, queryByText } = render(<EventDates event={event} language={language} compact />)

    expect(getByText('Mo., 9. Okt. - Di., 10. Okt.')).toBeTruthy()
    expect(getByText('7:00 - 9:00')).toBeTruthy()
    expect(queryByText('events:furtherDates')).toBeFalsy()
  })

  it('should render the next recurrence as the upcoming date for a recurring event', () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
    const { getByText } = render(<EventDates event={event} language={language} compact />)

    expect(getByText('Mo., 9. Okt. - Di., 10. Okt.')).toBeTruthy()
    expect(getByText('events:furtherDates')).toBeTruthy()
  })

  it('should reveal the upcoming dates when expanding a monthly recurring event', () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
    const { getByText, queryByText } = render(<EventDates event={event} language={language} compact />)

    expect(getByText('events:furtherDates')).toBeTruthy()
    expect(queryByText('Mo., 13. Nov. - Di., 14. Nov.')).toBeFalsy()

    fireEvent.press(getByText('events:furtherDates'))

    expect(getByText('Mo., 13. Nov. - Di., 14. Nov.')).toBeTruthy()
    expect(getByText('Mo., 11. Dez. - Di., 12. Dez.')).toBeTruthy()
    expect(getByText('Mo., 8. Jan. 2024 - Di., 9. Jan. 2024')).toBeTruthy()
    expect(queryByText('Mo., 11. März 2024 - Di., 12. März 2024')).toBeFalsy()
    expect(getByText('…')).toBeTruthy()
  })

  it('should reveal the upcoming dates when expanding a weekly recurring event', () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')
    const { getByText } = render(<EventDates event={event} language={language} compact />)

    fireEvent.press(getByText('events:furtherDates'))

    expect(getByText('Mo., 16. Okt. - Di., 17. Okt.')).toBeTruthy()
    expect(getByText('Mo., 23. Okt. - Di., 24. Okt.')).toBeTruthy()
    expect(getByText('…')).toBeTruthy()
  })

  it('should show the time if it differs between the dates', () => {
    const event = eventWithDate(
      'DTSTART:20231016T050000\nRDATE:20231016T050000\nRDATE:20231018T090000\nRDATE:20231020T130000',
    )
    const { getByText } = render(<EventDates event={event} language={language} compact />)

    fireEvent.press(getByText('events:furtherDates'))

    expect(getByText('Mi., 18. Okt. - Do., 19. Okt.')).toBeTruthy()
    expect(getByText('9:00 - 11:00')).toBeTruthy()
    expect(getByText('Fr., 20. Okt. - Sa., 21. Okt.')).toBeTruthy()
    expect(getByText('13:00 - 15:00')).toBeTruthy()
  })
})
