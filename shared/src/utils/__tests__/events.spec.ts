import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { EventModelBuilder, DateModel } from 'shared/api'

import { LocationModel } from '../../api/index.js'
import EventModel from '../../api/models/EventModel.js'
import { filterEvents, groupEventsByDate } from '../events.js'

jest.useFakeTimers({ now: new Date('2023-10-02T10:00:00.000+02:00') })

const EventModalDummyData = {
  content: '<h1>Event Content</h1>',
  thumbnail: null,
  location: new LocationModel({
    id: 1,
    name: 'Test Location',
    address: 'Test Street',
    town: 'Test Town',
    postcode: '12345',
    country: 'Test Country',
    latitude: null,
    longitude: null,
  }),
  meetingUrl: 'meeting-url',
  excerpt: 'This is a test event.',
  availableLanguages: {},
  lastUpdate: DateTime.fromISO('2024-11-07T00:00:00.000'),
  featuredImage: null,
  placePath: '/test/location/path',
}

describe('events', () => {
  describe('filterEvents', () => {
    const createEvent = (id: number, startDate: DateTime, endDate: DateTime): EventModel => {
      const dateModel = new DateModel({
        startDate,
        endDate,
        allDay: false,
        recurrenceRule: null,
        onlyWeekdays: false,
      })

      return new EventModel({
        ...EventModalDummyData,
        path: `/test/event-${id}`,
        title: `Test Event ${id}`,
        date: dateModel,
      })
    }

    const now = DateTime.local()

    const events = [
      createEvent(1, now.minus({ days: 5 }), now.minus({ days: 5 }).plus({ hours: 2 })), // start: 2023-11-02, end: start + plus 2H
      createEvent(2, now.minus({ days: 2 }), now.minus({ days: 2 }).plus({ hours: 2 })), // start: 2023-11-05, end: start + plus 2H
      createEvent(3, now.plus({ days: 1 }), now.plus({ days: 1 }).plus({ hours: 2 })), // start: 2023-11-08, end: start + plus 2H
      createEvent(4, now.plus({ days: 4 }), now.plus({ days: 4 }).plus({ hours: 2 })), // start: 2023-11-11, end: start + plus 2H
    ]

    it('returns all events when startDate and endDate are null', () => {
      const result = filterEvents(events, null, null)
      expect(result).toEqual(events)
    })

    it('returns null when startDate is after endDate', () => {
      const startDate = now.plus({ days: 2 })
      const endDate = now
      const result = filterEvents(events, startDate, endDate)
      expect(result).toEqual([])
    })

    it('filters events within the given date range', () => {
      const startDate = now.minus({ days: 3 })
      const endDate = now.plus({ days: 2 })

      const result = filterEvents(events, startDate, endDate)

      const expectedEvents = [events[1], events[2]]

      expect(result).toEqual(expectedEvents)
    })

    it('excludes events outside the given date range', () => {
      const startDate = now.plus({ days: 5 })
      const endDate = now.plus({ days: 10 })

      const result = filterEvents(events, startDate, endDate)

      expect(result).toEqual([])
    })

    it('includes events before the endDate when startDate is null', () => {
      const startDate = null
      const endDate = now

      const result = filterEvents(events, startDate, endDate)

      const expectedEvents = [events[0], events[1]]

      expect(result).toEqual(expectedEvents)
    })

    it('includes events after the startDate when endDate is null', () => {
      const startDate = now.plus({ days: 2 })
      const endDate = null

      const result = filterEvents(events, startDate, endDate)

      const expectedEvents = [events[3]]

      expect(result).toEqual(expectedEvents)
    })
  })

  describe('groupEventsByDate', () => {
    const language = 'de'
    const event = new EventModelBuilder('seed', 1, 'augsburg', language).build()[0]!

    const createEvent = (start: string, rrule?: string) =>
      Object.assign(event, {
        _date: new DateModel({
          startDate: DateTime.fromISO(start),
          endDate: null,
          allDay: false,
          recurrenceRule: rrule ? rrulestr(rrule) : null,
          onlyWeekdays: false,
        }),
      })

    it('should group an event starting today into today', () => {
      const event = createEvent('2023-10-02T15:00:00.000+02:00')
      const groups = groupEventsByDate([event])
      expect(groups.today).toContain(event)
    })

    it('should group an event starting tomorrow into tomorrow', () => {
      const event = createEvent('2023-10-03T15:00:00.000+02:00')
      const groups = groupEventsByDate([event])
      expect(groups.tomorrow).toContain(event)
    })

    it('should group an event a few days out into this week', () => {
      const event = createEvent('2023-10-07T15:00:00.000+02:00')
      const groups = groupEventsByDate([event])
      expect(groups.thisWeek).toContain(event)
    })

    it('should group an event a few weeks out into this month', () => {
      const event = createEvent('2023-10-25T15:00:00.000+02:00')
      const groups = groupEventsByDate([event])
      expect(groups.thisMonth).toContain(event)
    })

    it('should group an event beyond 30 days into further', () => {
      const event = createEvent('2023-12-01T15:00:00.000+02:00')
      const groups = groupEventsByDate([event])
      expect(groups.further).toContain(event)
    })

    it('should sort one-time events chronologically, then recurring chronologically', () => {
      const oneTimeEarly = createEvent('2023-10-02T10:00:00.000+02:00')
      const oneTimeLate = createEvent('2023-10-02T20:00:00.000+02:00')
      const recurringEarly = createEvent(
        '2023-10-02T08:00:00.000+02:00',
        'DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO',
      )
      const recurringLate = createEvent(
        '2023-10-02T22:00:00.000+02:00',
        'DTSTART:20230414T060000\nRRULE:FREQ=WEEKLY;BYDAY=MO',
      )

      const groups = groupEventsByDate([recurringLate, oneTimeLate, recurringEarly, oneTimeEarly])
      expect(groups.today).toEqual([oneTimeEarly, oneTimeLate, recurringEarly, recurringLate])
    })

    it('should group a recurring event by its next occurrence', () => {
      const recurring = createEvent(
        '2023-04-14T07:00:00.000+02:00',
        'DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO',
      )
      const groups = groupEventsByDate([recurring])
      expect(groups.today).toContain(recurring)
    })
  })
})
