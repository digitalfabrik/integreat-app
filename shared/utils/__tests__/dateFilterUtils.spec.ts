import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { LocationModel } from '../../api'
import DateModel from '../../api/models/DateModel'
import EventModel from '../../api/models/EventModel'
import { isEventWithinRange } from '../dateFilterUtils'

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

describe('isEventWithinRange', () => {
  const now = DateTime.local()

  const createEvent = (
    id: number,
    startDate: DateTime,
    endDate: DateTime,
    recurrenceRule: string | null = null,
  ): EventModel => {
    const dateModel = new DateModel({
      startDate,
      endDate,
      allDay: false,
      recurrenceRule: recurrenceRule ? rrulestr(recurrenceRule) : null,
      onlyWeekdays: false,
    })

    return new EventModel({
      ...EventModalDummyData,
      path: `/test/event-${id}`,
      title: `Test Event ${id}`,
      date: dateModel,
    })
  }

  it('should return true when event is within the date range', () => {
    const event = createEvent(1, now.minus({ days: 1 }), now.plus({ days: 1 }))
    const startDate = now.minus({ days: 2 })
    const endDate = now.plus({ days: 2 })

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return false when event is outside the date range', () => {
    const event = createEvent(2, now.minus({ days: 5 }), now.minus({ days: 4 }))
    const startDate = now.minus({ days: 3 })
    const endDate = now.plus({ days: 2 })

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(false)
  })

  it('should return true when event starts exactly on the startDate', () => {
    const event = createEvent(3, now.minus({ days: 2 }), now.plus({ days: 1 }))
    const startDate = now.minus({ days: 2 })
    const endDate = now.plus({ days: 2 })

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return true when event ends exactly on the endDate', () => {
    const event = createEvent(4, now.minus({ days: 3 }), now.minus({ days: 1 }))
    const startDate = now.minus({ days: 5 })
    const endDate = now.minus({ days: 1 })

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return true when event has future recurrences within the date range', () => {
    const recurrenceRule = 'FREQ=DAILY;COUNT=5'
    const event = createEvent(5, now.plus({ days: 1 }), now.plus({ days: 15 }), recurrenceRule)
    const startDate = now
    const endDate = now.plus({ days: 7 })

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return true when startDate and endDate are null (event always within range)', () => {
    const event = createEvent(6, now.minus({ days: 1 }), now.plus({ days: 1 }))

    const result = isEventWithinRange(event, null, null)
    expect(result).toBe(true)
  })
})
