import { DateTime } from 'luxon'
import { useState, useMemo } from 'react'

import EventModel from '../api/models/EventModel.ts'
import { filterEvents } from '../utils/events.ts'

type UseDateFilterReturn = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
  filteredEvents: EventModel[]
  startDateError: string | null
}

const useDateFilter = (events: EventModel[]): UseDateFilterReturn => {
  const [startDate, setStartDate] = useState<DateTime | null>(null)
  const [endDate, setEndDate] = useState<DateTime | null>(null)
  const isStartAfterEnd = startDate && endDate && startDate > endDate
  const startDateError = isStartAfterEnd ? 'shouldBeEarlier' : null

  const filteredEvents = useMemo(() => filterEvents(events, startDate, endDate), [startDate, endDate, events])

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
