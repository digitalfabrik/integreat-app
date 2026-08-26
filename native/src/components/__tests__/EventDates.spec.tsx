import { fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { DateModel, EventModelBuilder } from 'shared/api'

import render from '../../testing/render'
import EventDates from '../EventDates'

jest.mock('react-i18next')

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

    expect(getByText('9. Okt. - 10. Okt.')).toBeTruthy()
    expect(getByText('7:00 - 9:00')).toBeTruthy()
    expect(queryByText('furtherDates')).toBeFalsy()
  })

  it('should render the next recurrence as the upcoming date for a recurring event', () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
    const { getByText } = render(<EventDates event={event} language={language} compact />)

    expect(getByText('9. Okt. - 10. Okt.')).toBeTruthy()
    expect(getByText('furtherDates')).toBeTruthy()
  })

  it('should reveal the upcoming dates when expanding a monthly recurring event', () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=MONTHLY;BYDAY=+2MO')
    const { getByText, queryByText } = render(<EventDates event={event} language={language} compact />)

    expect(getByText('furtherDates')).toBeTruthy()
    expect(queryByText('13. Nov. - 14. Nov.')).toBeFalsy()

    fireEvent.press(getByText('furtherDates'))

    expect(getByText('13. Nov. - 14. Nov.')).toBeTruthy()
    expect(getByText('11. Dez. - 12. Dez.')).toBeTruthy()
    expect(getByText('8. Jan. 2024 - 9. Jan. 2024')).toBeTruthy()
    expect(queryByText('12. Feb. 2024 - 13. Feb. 2024')).toBeFalsy()
    expect(getByText('…')).toBeTruthy()
  })

  it('should reveal the upcoming dates when expanding a weekly recurring event', () => {
    const event = eventWithDate('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO')
    const { getByText } = render(<EventDates event={event} language={language} compact />)

    fireEvent.press(getByText('furtherDates'))

    expect(getByText('16. Okt. - 17. Okt.')).toBeTruthy()
    expect(getByText('23. Okt. - 24. Okt.')).toBeTruthy()
    expect(getByText('…')).toBeTruthy()
  })

  it('should show the time if it differs between the dates', () => {
    const event = eventWithDate(
      'DTSTART:20231016T050000\nRDATE:20231016T050000\nRDATE:20231018T090000\nRDATE:20231020T130000',
    )
    const { getByText } = render(<EventDates event={event} language={language} compact />)

    fireEvent.press(getByText('furtherDates'))

    expect(getByText('18. Okt. - 19. Okt.')).toBeTruthy()
    expect(getByText('9:00 - 11:00')).toBeTruthy()
    expect(getByText('20. Okt. - 21. Okt.')).toBeTruthy()
    expect(getByText('13:00 - 15:00')).toBeTruthy()
  })
})
