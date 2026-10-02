import { useCallback } from 'react'

import { addVisitedId as addVisitedIdToVisitedIds, getVisitedIds, VisitedIdsType } from 'shared'

import useLocalStorage from './useLocalStorage'

type UseVisitedIdsReturn = [visitedIds: string[], addVisitedId: (id: string) => void]

const useVisitedIds = ({ key, regionCode }: { key: string; regionCode: string }): UseVisitedIdsReturn => {
  const [visitedIds, setVisitedIds] = useLocalStorage<VisitedIdsType>({
    key,
    initialValue: {},
  })

  const addVisitedId = useCallback(
    (id: string) => setVisitedIds(previous => addVisitedIdToVisitedIds(previous, regionCode, id)),
    [regionCode, setVisitedIds],
  )

  return [getVisitedIds(visitedIds, regionCode), addVisitedId]
}

export default useVisitedIds
