import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import DateModel from '../../api/models/DateModel'
import EventModel from '../../api/models/EventModel'
import { EventModalDummyData as baseParams, isEventWithinRange } from '../dateFilterUtils'

jest.useFakeTimers({ now: new Date('2024-11-07T00:00:00.000') })

describe('isEventWithinRange', () => {
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
    })

    return new EventModel({
      ...baseParams,
      path: `/test/event-${id}`,
      title: `Test Event ${id}`,
      date: dateModel,
    })
  }

  const now = DateTime.local() // 2024-11-07

  it('should return true when event is within the date range', () => {
    const event = createEvent(
      1,
      now.minus({ days: 1 }), // 2024-11-06
      now.plus({ days: 1 }), // 2024-11-08
    )
    const startDate = now.minus({ days: 2 }) // 2024-11-05
    const endDate = now.plus({ days: 2 }) // 2024-11-09

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return false when event is outside the date range', () => {
    const event = createEvent(
      2,
      now.minus({ days: 5 }), // 2024-11-02
      now.minus({ days: 4 }), // 2024-11-03
    )
    const startDate = now.minus({ days: 3 }) // 2024-11-04
    const endDate = now.plus({ days: 2 }) // 2024-11-09

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(false)
  })

  it('should return true when event starts exactly on the startDate', () => {
    const event = createEvent(
      3,
      now.minus({ days: 2 }), // 2024-11-05
      now.plus({ days: 1 }), // 2024-11-08
    )
    const startDate = now.minus({ days: 2 }) // 2024-11-05
    const endDate = now.plus({ days: 2 }) // 2024-11-09

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return true when event ends exactly on the endDate', () => {
    const event = createEvent(
      4,
      now.minus({ days: 3 }), // 2024-11-04
      now.minus({ days: 1 }), // 2024-11-06
    )
    const startDate = now.minus({ days: 5 }) // 2024-11-02
    const endDate = now.minus({ days: 1 }) // 2024-11-06

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return true when event has future recurrences within the date range', () => {
    const recurrenceRule = 'FREQ=DAILY;COUNT=5'
    const event = createEvent(
      5,
      now.plus({ days: 1 }), // 2024-11-08
      now.plus({ days: 15 }), // 2024-11-22
      recurrenceRule,
    )
    const startDate = now // 2024-11-07
    const endDate = now.plus({ days: 7 }) // 2024-11-14

    const result = isEventWithinRange(event, startDate, endDate)
    expect(result).toBe(true)
  })

  it('should return true when startDate and endDate are null (event always within range)', () => {
    const event = createEvent(
      6,
      now.minus({ days: 1 }), // 2024-11-06
      now.plus({ days: 1 }), // 2024-11-08
    )

    const result = isEventWithinRange(event, null, null)
    expect(result).toBe(true)
  })
})
