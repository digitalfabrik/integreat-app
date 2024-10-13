import { DateTime } from 'luxon'
import { useState, useMemo } from 'react'

import { EventModel } from 'shared/api'
import { isEventWithinRange, UseDateFilterReturn } from 'shared/utils/dateFilterUtils'

const useDateFilter = (events: EventModel[] | null): UseDateFilterReturn => {
  const [startDate, setStartDate] = useState<DateTime | null>(null)
  const [endDate, setEndDate] = useState<DateTime | null>(null)
  const startDateError = startDate && endDate && startDate > endDate ? 'shouldBeEarlier' : null

  const filteredEvents = useMemo(() => {
    if (!startDate && !endDate) {
      return events
    }

    const isStartAfterEnd = startDate && endDate && startDate > endDate
    if (!events || isStartAfterEnd) {
      return null
    }
    return events.filter(event => isEventWithinRange(event, startDate, endDate))
  }, [startDate, endDate, events])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredEvents,
    startDateError,
  }
}

export default useDateFilter
