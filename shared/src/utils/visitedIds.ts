import { DateTime } from 'luxon'

import { MAX_DAYS_NEW } from '../constants/index.ts'

export type VisitedIdsType = { [regionCode: string]: { [id: string]: string } }

// Content visited more than MAX_DAYS_NEW days ago cannot be new anymore, so there is no need to remember it
export const removeExpiredVisitedIds = (visitedIds: VisitedIdsType): VisitedIdsType => {
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

export const addVisitedId = (visitedIds: VisitedIdsType, regionCode: string, id: string): VisitedIdsType =>
  removeExpiredVisitedIds({
    ...visitedIds,
    [regionCode]: { ...(visitedIds[regionCode] ?? {}), [id]: DateTime.now().toISODate() },
  })

export const getVisitedIds = (visitedIds: VisitedIdsType, regionCode: string): string[] =>
  Object.keys(visitedIds[regionCode] ?? {})
