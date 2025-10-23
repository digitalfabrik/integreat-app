import { useCallback } from 'react'

import { useLoadAsync, ReturnType } from 'shared/api'

import { LanguageResourceCacheStateType } from '../utils/DataContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { useAppContext } from './useCityAppContext'

const useResourceCache = (): ReturnType<LanguageResourceCacheStateType> & { data: LanguageResourceCacheStateType } => {
  const { cityCode, languageCode } = useAppContext()
  const response = useLoadAsync(
    useCallback(
      async () => (cityCode ? dataContainer.getResourceCache(cityCode, languageCode) : null),
      [cityCode, languageCode],
    ),
  )
  return { ...response, data: response.data ?? {} }
}

export default useResourceCache
