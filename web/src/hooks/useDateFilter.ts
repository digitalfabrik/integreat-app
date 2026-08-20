import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { END_DATE_QUERY_KEY, filterEvents, START_DATE_QUERY_KEY } from 'shared'
import { EventModel } from 'shared/api'

import useQueryParam from './useQueryParam'

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
  const [start, setStart] = useQueryParam(START_DATE_QUERY_KEY, { replace: true })
  const [end, setEnd] = useQueryParam(END_DATE_QUERY_KEY, { replace: true })
  const [queryParams, setQueryParams] = useSearchParams()
  const { t } = useTranslation(['events'])

  const startDate = start ?? null
  const endDate = end ?? null
  const setStartDate = (startDate: DateTime | null) => setStart(startDate ?? undefined)
  const setEndDate = (endDate: DateTime | null) => setEnd(endDate ?? undefined)

  const resetDates = () => {
    const newQueryParams = new URLSearchParams(queryParams)
    newQueryParams.delete(START_DATE_QUERY_KEY)
    newQueryParams.delete(END_DATE_QUERY_KEY)
    setQueryParams(newQueryParams, { replace: true })
  }

  const startDateError = startDate && endDate && startDate > endDate ? t($ => $.shouldBeEarlier) : null
  const filteredEvents = useMemo(() => filterEvents(events, startDate, endDate), [startDate, endDate, events])

  return { startDate, setStartDate, endDate, setEndDate, filteredEvents, startDateError, resetDates }
}

export default useDateFilter
