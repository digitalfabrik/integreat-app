import { DateTime } from 'luxon'

import EventModel from '../api/models/EventModel'
import { isEventWithinRange } from './dateFilterUtils'

const filteringEventsLogic = (
  events: EventModel[] | null,
  startDate: DateTime | null,
  endDate: DateTime | null,
): EventModel[] | null => {
  const isStartAfterEnd = startDate && endDate && startDate > endDate
  if (!startDate && !endDate) {
    return events
  }

  if (!events || isStartAfterEnd) {
    return null
  }
  return events.filter(event => isEventWithinRange(event, startDate, endDate))
}

export default filteringEventsLogic
