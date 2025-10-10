import { useCallback } from 'react'

import { useLoadAsync } from 'shared/api'

import { LanguageResourceCacheStateType } from '../utils/DataContainer'
import dataContainer from '../utils/DefaultDataContainer'

type UseResourceCacheProps = {
  cityCode: string
  languageCode: string
}

const useResourceCache = ({
  cityCode,
  languageCode,
}: UseResourceCacheProps): { data: LanguageResourceCacheStateType; refresh: () => void } => {
  const result = useLoadAsync(
    useCallback(() => dataContainer.getResourceCache(cityCode, languageCode), [cityCode, languageCode]),
  )

  return {
    data: result.data ?? {},
    refresh: result.refresh,
  }
}

export default useResourceCache
