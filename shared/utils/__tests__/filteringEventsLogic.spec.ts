import { DateTime } from 'luxon'

import { LocationModel } from '../../api'
import DateModel from '../../api/models/DateModel'
import EventModel from '../../api/models/EventModel'
import filteringEventsLogic from '../filteringEventsLogic'

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
  poiPath: '/test/location/path',
}

jest.useFakeTimers({ now: new Date('2024-11-07T00:00:00.000') })
describe('filteringEventsLogic', () => {
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
    createEvent(1, now.minus({ days: 5 }), now.minus({ days: 5 }).plus({ hours: 2 })), // start: 2024-11-02, end: start + plus 2H
    createEvent(2, now.minus({ days: 2 }), now.minus({ days: 2 }).plus({ hours: 2 })), // start: 2024-11-05, end: start + plus 2H
    createEvent(3, now.plus({ days: 1 }), now.plus({ days: 1 }).plus({ hours: 2 })), // start: 2024-11-08, end: start + plus 2H
    createEvent(4, now.plus({ days: 4 }), now.plus({ days: 4 }).plus({ hours: 2 })), // start: 2024-11-11, end: start + plus 2H
  ]

  it('returns all events when startDate and endDate are null', () => {
    const result = filteringEventsLogic(events, null, null)
    expect(result).toEqual(events)
  })

  it('returns null when startDate is after endDate', () => {
    const startDate = now.plus({ days: 2 })
    const endDate = now
    const result = filteringEventsLogic(events, startDate, endDate)
    expect(result).toBeNull()
  })

  it('filters events within the given date range', () => {
    const startDate = now.minus({ days: 3 })
    const endDate = now.plus({ days: 2 })

    const result = filteringEventsLogic(events, startDate, endDate)

    const expectedEvents = [events[1], events[2]]

    expect(result).toEqual(expectedEvents)
  })

  it('excludes events outside the given date range', () => {
    const startDate = now.plus({ days: 5 })
    const endDate = now.plus({ days: 10 })

    const result = filteringEventsLogic(events, startDate, endDate)

    expect(result).toEqual([])
  })

  it('includes events before the endDate when startDate is null', () => {
    const startDate = null
    const endDate = now

    const result = filteringEventsLogic(events, startDate, endDate)

    const expectedEvents = [events[0], events[1]]

    expect(result).toEqual(expectedEvents)
  })

  it('includes events after the startDate when endDate is null', () => {
    const startDate = now.plus({ days: 2 })
    const endDate = null

    const result = filteringEventsLogic(events, startDate, endDate)

    const expectedEvents = [events[3]]

    expect(result).toEqual(expectedEvents)
  })
})
