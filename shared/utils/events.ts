import { DateTime } from 'luxon'

import EventModel from '../api/models/EventModel.js'

export type DateGroupKey = 'today' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'further'

export const EVENT_DATE_GROUPS: DateGroupKey[] = ['today', 'tomorrow', 'thisWeek', 'thisMonth', 'further']

const eventGroups: Record<Exclude<DateGroupKey, 'further'>, number> = {
  today: 0,
  tomorrow: 1,
  thisWeek: 7,
  thisMonth: 30,
}

export const getGroupKey = (event: EventModel): DateGroupKey => {
  const now = DateTime.now()
  const labels = Object.keys(eventGroups) as Exclude<DateGroupKey, 'further'>[]
  return labels.find(label => event.date.startDate <= now.plus({ days: eventGroups[label] }).endOf('day')) ?? 'further'
}

const sortGroup = (events: EventModel[]): EventModel[] =>
  [...events].sort((a, b) => {
    if (a.isRecurring !== b.isRecurring) {
      return a.isRecurring ? 1 : -1
    }
    return a.date.startDate.toMillis() - b.date.startDate.toMillis()
  })

export const groupEventsByDate = (events: EventModel[]): Record<DateGroupKey, EventModel[]> =>
  Object.fromEntries(
    EVENT_DATE_GROUPS.map(key => [key, sortGroup(events.filter(event => getGroupKey(event) === key))]),
  ) as Record<DateGroupKey, EventModel[]>
