import { DateTime } from 'luxon'

import EventModel from '../api/models/EventModel.js'

const WEEK = 7

export type DateGroupKey = 'today' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'further'

export const GROUP_ORDER: DateGroupKey[] = ['today', 'tomorrow', 'thisWeek', 'thisMonth', 'further']

const isRecurring = (event: EventModel): boolean => event.date.hasMoreRecurrencesThan(1)

export const getGroupKey = (event: EventModel): DateGroupKey => {
  if (event.date.isToday) {
    return 'today'
  }

  const now = DateTime.now()
  const start = event.date.startDate

  if (start.hasSame(now.plus({ days: 1 }), 'day')) {
    return 'tomorrow'
  }

  const today = now.startOf('day')
  const startDay = start.startOf('day')
  const diffDays = Math.round(startDay.diff(today, 'days').days)

  if (diffDays <= WEEK) {
    return 'thisWeek'
  }

  const endOfMonth = now.endOf('month').startOf('day')
  if (startDay <= endOfMonth) {
    return 'thisMonth'
  }

  return 'further'
}

const sortGroup = (events: EventModel[]): EventModel[] => {
  const byDate = (a: EventModel, b: EventModel): number => a.date.startDate.toMillis() - b.date.startDate.toMillis()

  const oneTimeEvent = events.filter(event => !isRecurring(event)).sort(byDate)
  const recurringEvent = events.filter(event => isRecurring(event)).sort(byDate)

  return [...oneTimeEvent, ...recurringEvent]
}

export const groupEvents = (events: EventModel[]): Record<DateGroupKey, EventModel[]> => {
  const groups: Record<DateGroupKey, EventModel[]> = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    thisMonth: [],
    further: [],
  }

  events.forEach(event => {
    groups[getGroupKey(event)].push(event)
  })

  GROUP_ORDER.forEach(key => {
    groups[key] = sortGroup(groups[key])
  })

  return groups
}
