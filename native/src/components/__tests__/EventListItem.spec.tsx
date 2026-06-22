import { DateTime } from 'luxon'
import React from 'react'
import { rrulestr } from 'rrule'

import { getGroupKey, groupEvents } from 'shared'
import { EventModelBuilder, DateModel, EventModel } from 'shared/api'

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

  describe('groupEvents', () => {
    const createEvent = (startISO: string, rrule?: string) =>
      Object.assign(event, {
        _date: new DateModel({
          startDate: DateTime.fromISO(startISO),
          endDate: null,
          allDay: false,
          recurrenceRule: rrule ? rrulestr(rrule) : null,
          onlyWeekdays: false,
        }),
      })

    it('should put an event starting tomorrow into the tomorrow group', () => {
      const event = createEvent('2023-10-03T15:00:00.000+02:00')
      expect(getGroupKey(event)).toBe('tomorrow')
    })

    it('should put an event in 4 days into this week group', () => {
      const event = createEvent('2023-10-07T15:00:00.000+02:00')
      expect(getGroupKey(event)).toBe('thisWeek')
    })

    it('should put an event 3 weeks after into this month bucket', () => {
      const event = createEvent('2023-10-25T15:00:00.000+02:00')
      expect(getGroupKey(event)).toBe('thisMonth')
    })

    it('should put an event beyond 30 days into further group', () => {
      const event = createEvent('2023-12-01T15:00:00.000+02:00')
      expect(getGroupKey(event)).toBe('further')
    })

    it('should sort one-time event before recurring event within the same today group', () => {
      const makeEvent = (startISO: string, rrule?: string): EventModel =>
        Object.assign(Object.create(Object.getPrototypeOf(event)), event, {
          _date: new DateModel({
            startDate: DateTime.fromISO(startISO),
            endDate: null,
            allDay: false,
            recurrenceRule: rrule ? rrulestr(rrule) : null,
            onlyWeekdays: false,
          }),
        })

      const oneTimeEvent = makeEvent('2023-10-02T18:00:00.000+02:00')
      const recurringEvent = makeEvent(
        '2023-10-02T09:00:00.000+02:00',
        'DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO',
      )

      const groups = groupEvents([recurringEvent, oneTimeEvent])
      expect(groups.today.indexOf(oneTimeEvent)).toBeLessThan(groups.today.indexOf(recurringEvent))
      expect(getGroupKey(oneTimeEvent)).toBe('today')
      expect(getGroupKey(recurringEvent)).toBe('today')
    })
  })
})
