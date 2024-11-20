import { DateTime } from 'luxon'

import { DateModel, EventModel, LocationModel } from '../api'
import { MAX_DATE_RECURRENCES } from '../constants'

export const EventModalDummyData = {
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
  excerpt: 'This is a test event.',
  availableLanguages: {},
  lastUpdate: DateTime.fromISO('2024-11-07T00:00:00.000'),
  featuredImage: null,
  poiPath: '/test/location/path',
}

const isWithinDateRange = (
  startDate: DateTime | null,
  endDate: DateTime | null,
  eventStartDate: DateTime,
  eventEndDate: DateTime,
): boolean => {
  const endDateTime = endDate?.endOf('day')
  return (!endDateTime || eventStartDate <= endDateTime) && (!startDate || eventEndDate >= startDate)
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
