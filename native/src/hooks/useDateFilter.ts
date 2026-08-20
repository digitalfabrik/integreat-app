import { useNavigation, useRoute } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { EventsRouteType, filterEvents } from 'shared'
import { EventModel } from 'shared/api'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'

type UseDateFilterReturn = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
  filteredEvents: EventModel[]
  startDateError: string | null
}

const useDateFilter = (events: EventModel[]): UseDateFilterReturn => {
  const navigation = useNavigation<NavigationProps<EventsRouteType>>()
  const { params } = useRoute<RouteProps<EventsRouteType>>()
  const { t } = useTranslation(['events'])

  const startDate = params.startDate ?? null
  const endDate = params.endDate ?? null
  const isStartAfterEnd = startDate && endDate && startDate > endDate
  const startDateError = isStartAfterEnd ? t($ => $.shouldBeEarlier) : null

  const filteredEvents = useMemo(() => filterEvents(events, startDate, endDate), [startDate, endDate, events])

  return {
    startDate,
    setStartDate: startDate => navigation.setParams({ startDate: startDate ?? undefined }),
    endDate,
    setEndDate: endDate => navigation.setParams({ endDate: endDate ?? undefined }),
    filteredEvents,
    startDateError,
  }
}

export default useDateFilter
