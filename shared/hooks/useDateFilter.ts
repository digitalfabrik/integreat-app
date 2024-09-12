import { DateTime } from 'luxon'
import { useState, useMemo } from 'react'

import { EventModel } from 'shared/api'

type UseDateFilterReturn = {
  fromDate: DateTime | null
  setFromDate: (fromDate: DateTime | null) => void
  toDate: DateTime | null
  setToDate: (toDate: DateTime | null) => void
  filteredEvents: EventModel[]
  fromDateError: string | null
  toDateError: string | null
}

const useDateFilter = (events: EventModel[] | null, isClear: boolean): UseDateFilterReturn => {
  const [fromDate, setFromDate] = useState<DateTime | null>(DateTime.now())
  const [toDate, setToDate] = useState<DateTime | null>(DateTime.now().plus({ year: 1 }))
  const toDateError = toDate ? null : 'invalidToDate'
  const isEarlierError = fromDate && toDate && fromDate > toDate ? 'shouldBeEarlier' : null
  const fromDateError = fromDate ? isEarlierError : 'invalidFromDate'

  const filteredEvents = useMemo(() => {
    if (!fromDate || !toDate || fromDate > toDate) {
      return []
    }

    const fromDateTime = fromDate
    const toDateTime = toDate.endOf('day')

    return isClear
      ? events || []
      : events?.filter(event => event.date.startDate <= toDateTime && event.date.endDate >= fromDateTime) || []
  }, [fromDate, toDate, isClear, events])

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    filteredEvents,
    fromDateError,
    toDateError,
  }
}

export default useDateFilter
