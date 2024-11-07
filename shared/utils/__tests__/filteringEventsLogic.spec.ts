// filteringEventsLogic.spec.ts
import { DateTime } from 'luxon'

import DateModel from '../../api/models/DateModel'
import EventModel from '../../api/models/EventModel'
import { EventModalDummyData as baseParams } from '../dateFilterUtils'
import filteringEventsLogic from '../filteringEventsLogic'

jest.useFakeTimers({ now: new Date('2024-11-07T00:00:00.000') })
describe('filteringEventsLogic', () => {
  const createEvent = (id: number, startDate: DateTime, endDate: DateTime): EventModel => {
    const dateModel = new DateModel({
      startDate,
      endDate,
      allDay: false,
      recurrenceRule: null,
    })

    return new EventModel({
      ...baseParams,
      path: `/test/event-${id}`,
      title: `Test Event ${id}`,
      date: dateModel,
    })
  }

  const now = DateTime.local()

  const events = [
    createEvent(1, now.minus({ days: 5 }), now.minus({ days: 5 }).plus({ hours: 2 })),
    createEvent(2, now.minus({ days: 2 }), now.minus({ days: 2 }).plus({ hours: 2 })),
    createEvent(3, now.plus({ days: 1 }), now.plus({ days: 1 }).plus({ hours: 2 })),
    createEvent(4, now.plus({ days: 4 }), now.plus({ days: 4 }).plus({ hours: 2 })),
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
    const endDate = now.plus({ days: 0 })

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
