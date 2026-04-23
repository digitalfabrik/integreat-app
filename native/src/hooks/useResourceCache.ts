import { useCallback } from 'react'

import { useLoadAsync, ReturnType } from 'shared/api'

import { LanguageResourceCacheStateType } from '../utils/DataContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { useAppContext } from './useRegionAppContext'

const useResourceCache = (): ReturnType<LanguageResourceCacheStateType> & { data: LanguageResourceCacheStateType } => {
  const { regionCode, languageCode } = useAppContext()
  const response = useLoadAsync(
    useCallback(
      async () => (regionCode ? dataContainer.getResourceCache(regionCode, languageCode) : null),
      [regionCode, languageCode],
    ),
  )
  return { ...response, data: response.data ?? {} }
}

export default useResourceCache
