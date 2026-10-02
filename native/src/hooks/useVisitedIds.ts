import { useCallback, useContext } from 'react'

import { addVisitedId as addVisitedIdToVisitedIds, getVisitedIds } from 'shared'

import { AppContext } from '../contexts/AppContext'

type VisitedIdsSettingsKey = 'visitedEventIds'

type UseVisitedIdsProps = {
  key: VisitedIdsSettingsKey
  regionCode: string
}

type UseVisitedIdsReturn = [visitedIds: string[], addVisitedId: (id: string) => void]

const useVisitedIds = ({ key, regionCode }: UseVisitedIdsProps): UseVisitedIdsReturn => {
  const { settings, updateSettings } = useContext(AppContext)

  const addVisitedId = useCallback(
    (id: string) =>
      updateSettings(oldSettings => ({ [key]: addVisitedIdToVisitedIds(oldSettings[key], regionCode, id) })),
    [key, regionCode, updateSettings],
  )

  return [getVisitedIds(settings[key], regionCode), addVisitedId]
}

export default useVisitedIds
