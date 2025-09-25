import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { EventModelBuilder, DateModel } from 'shared/api'

import render from '../../testing/render'
import EventListItem from '../EventListItem'

jest.mock('react-i18next')

jest.useFakeTimers({ now: new Date('2023-10-02T05:23:57.443+02:00') })
describe('EventListItem', () => {
  const language = 'de'

  const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!
  const navigateToEvent = jest.fn()

  it('should show event list item with specific thumbnail', () => {
    const { getByText } = render(<EventListItem event={event} language={language} navigateToEvent={navigateToEvent} />)

    expect(getByText(event.title)).toBeTruthy()
    expect(getByText(event.date.formatEventDateInOneLine(language, jest.fn()))).toBeTruthy()
  })

  describe('date icon', () => {
    const createEvent = (rrule?: string) =>
      Object.assign(event, {
        _date: new DateModel({
          startDate: DateTime.fromISO('2023-10-09T07:00:00.000+02:00'),
          endDate: DateTime.fromISO('2023-10-10T09:00:00.000+02:00'),
          allDay: false,
          recurrenceRule: rrule ? rrulestr(rrule) : null,
          onlyWeekdays: false,
        }),
      })

    it('should show no icon if neither recurring nor today', () => {
      const event = createEvent()

      const { queryByLabelText } = render(
        <EventListItem event={event} language={language} navigateToEvent={navigateToEvent} />,
      )

      expect(queryByLabelText('todayRecurring')).toBeFalsy()
      expect(queryByLabelText('recurring')).toBeFalsy()
      expect(queryByLabelText('today')).toBeFalsy()
    })

    it('should show icon if recurring and today', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231029T050000')

      const { queryByLabelText, getByLabelText } = render(
        <EventListItem event={event} language={language} navigateToEvent={navigateToEvent} />,
      )

      expect(getByLabelText('todayRecurring')).toBeTruthy()
      expect(queryByLabelText('recurring')).toBeFalsy()
      expect(queryByLabelText('today')).toBeFalsy()
    })

    it('should show icon if recurring but not today', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=TU;UNTIL=20231029T050000')

      const { queryByLabelText, getByLabelText } = render(
        <EventListItem event={event} language={language} navigateToEvent={navigateToEvent} />,
      )

      expect(getByLabelText('recurring')).toBeTruthy()
      expect(queryByLabelText('todayRecurring')).toBeFalsy()
      expect(queryByLabelText('today')).toBeFalsy()
    })

    it('should show icon if today but not recurring', () => {
      const event = createEvent('DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20231003T050000')

      const { queryByLabelText, getByLabelText } = render(
        <EventListItem event={event} language={language} navigateToEvent={navigateToEvent} />,
      )

      expect(getByLabelText('today')).toBeTruthy()
      expect(queryByLabelText('todayRecurring')).toBeFalsy()
      expect(queryByLabelText('recurring')).toBeFalsy()
    })
  })
})
