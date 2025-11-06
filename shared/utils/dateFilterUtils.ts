import { DateTime } from 'luxon'

import { DateModel, EventModel } from '../api'
import { MAX_DATE_RECURRENCES } from '../constants'

const isWithinDateRange = (
  startDate: DateTime | null,
  endDate: DateTime | null,
  eventStartDate: DateTime,
  eventEndDate: DateTime | null,
): boolean => {
  const endDateTime = endDate?.endOf('day')
  return (
    (!endDateTime || eventStartDate <= endDateTime) &&
    (!startDate || (eventEndDate !== null && eventEndDate >= startDate))
  )
}

export const isEventWithinRange = (
  event: EventModel,
  startDate: DateTime | null,
  endDate: DateTime | null,
): boolean => {
  const isWithinRange = isWithinDateRange(startDate, endDate, event.date.startDate, event.date.endDate)

  if (event.date.recurrenceRule) {
    const recurrences = event.date.recurrences(MAX_DATE_RECURRENCES, startDate?.startOf('day'), endDate?.endOf('day'))
    const hasValidRecurrence = recurrences.some(recurrence =>
      isWithinDateRange(startDate, endDate, recurrence.startDate, recurrence.endDate),
    )
    return isWithinRange || hasValidRecurrence
  }

  return isWithinRange
}

export const getDisplayDate = (event: EventModel, startDate: DateTime | null, endDate: DateTime | null): DateModel => {
  if (!event.date.recurrenceRule) {
    return event.date
  }

  const recurrences = event.date.recurrences(
    1,
    startDate?.startOf('day') ?? DateTime.now().startOf('day'),
    endDate?.endOf('day') ?? null,
  )

  if (recurrences.length > 0) {
    return recurrences[0] ?? event.date
  }

  return event.date
}

export const zeroPad = (value: string): string => (value.length === 1 ? `0${value}` : value)
