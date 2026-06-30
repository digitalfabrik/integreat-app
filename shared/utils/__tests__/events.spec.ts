import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { EventModelBuilder, DateModel } from 'shared/api'

import { groupEventsByDate } from '../events.js'

jest.useFakeTimers({ now: new Date('2023-10-02T10:00:00.000+02:00') })
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
