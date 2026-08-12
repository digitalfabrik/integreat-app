import { DateTime } from 'luxon'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { filterEvents } from 'shared'
import { EventModel } from 'shared/api'

const parseDate = (value: string | null) => (value ? DateTime.fromISO(value) : null)

type UseSharedDateFilterReturn = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
  filteredEvents: EventModel[]
  startDateError: string | null
  resetDates: () => void
}

const useDateFilter = (events: EventModel[]): UseSharedDateFilterReturn => {
  const [searchParams, setSearchParams] = useSearchParams()

  const startDate = parseDate(searchParams.get('startDate'))
  const endDate = parseDate(searchParams.get('endDate'))

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
        params.delete('startDate')
        params.delete('endDate')
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
