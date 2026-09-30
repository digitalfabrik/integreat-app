import { DateTime } from 'luxon'
import { useCallback } from 'react'

import { MAX_DAYS_NEW } from 'shared'

import useLocalStorage from './useLocalStorage'

type VisitedIdsType = { [regionCode: string]: { [id: string]: string } }

type UseVisitedIdsReturn = [visitedIds: string[], addVisitedId: (id: string) => void]

// Content visited more than MAX_DAYS_NEW days ago cannot be new anymore, so there is no need to remember it
const removeExpiredIds = (visitedIds: VisitedIdsType): VisitedIdsType => {
  const now = DateTime.now()
  const isExpired = (visitedAt: string) => now.diff(DateTime.fromISO(visitedAt)).as('days') >= MAX_DAYS_NEW
  return Object.fromEntries(
    Object.entries(visitedIds)
      .map(
        ([regionCode, ids]) =>
          [
            regionCode,
            Object.fromEntries(Object.entries(ids).filter(([_, visitedAt]) => !isExpired(visitedAt))),
          ] as const,
      )
      .filter(([_, ids]) => Object.keys(ids).length > 0),
  )
}

const useVisitedIds = ({ key, regionCode }: { key: string; regionCode: string }): UseVisitedIdsReturn => {
  const [visitedIds, setVisitedIds] = useLocalStorage<VisitedIdsType>({
    key,
    initialValue: {},
  })
  const regionVisitedIds = visitedIds[regionCode] ?? {}

  const addVisitedId = useCallback(
    (id: string) =>
      setVisitedIds(previous =>
        removeExpiredIds({
          ...previous,
          [regionCode]: { ...(previous[regionCode] ?? {}), [id]: DateTime.now().toISODate() },
        }),
      ),
    [regionCode, setVisitedIds],
  )

  return [Object.keys(regionVisitedIds), addVisitedId]
}

export default useVisitedIds
