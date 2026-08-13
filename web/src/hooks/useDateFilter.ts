import { DateTime } from 'luxon'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { filterEvents } from 'shared'
import { EventModel } from 'shared/api'

const START_DATE_QUERY_KEY = 'startDate'
const END_DATE_QUERY_KEY = 'endDate'

const parseDate = (value: string | null) => (value ? DateTime.fromISO(value) : null)

type UseDateFilterReturn = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
  filteredEvents: EventModel[]
  startDateError: string | null
  resetDates: () => void
}

const useDateFilter = (events: EventModel[]): UseDateFilterReturn => {
  const [searchParams, setSearchParams] = useSearchParams()

  const startDate = parseDate(searchParams.get(START_DATE_QUERY_KEY))
  const endDate = parseDate(searchParams.get(END_DATE_QUERY_KEY))

  const setDate = useCallback(
    (key: string, date: DateTime | null) => {
      setSearchParams(
        prevParams => {
          const params = new URLSearchParams(prevParams)
          const isoDate = date?.isValid ? date.toISODate() : null
          if (isoDate) {
            params.set(key, isoDate)
          } else {
            params.delete(key)
          }
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setStartDate = (date: DateTime | null) => setDate('startDate', date)
  const setEndDate = (date: DateTime | null) => setDate('endDate', date)

  const resetDates = () => {
    setSearchParams(
      prevParams => {
        const params = new URLSearchParams(prevParams)
        params.delete(START_DATE_QUERY_KEY)
        params.delete(END_DATE_QUERY_KEY)
        return params
      },
      { replace: true },
    )
  }

  const startDateError = startDate && endDate && startDate > endDate ? 'shouldBeEarlier' : null
  const filteredEvents = useMemo(() => filterEvents(events, startDate, endDate), [startDate, endDate, events])

  return { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError, resetDates }
}

export default useDateFilter
