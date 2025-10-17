import { useCallback } from 'react'

import { useLoadAsync } from 'shared/api'

import { LanguageResourceCacheStateType } from '../utils/DataContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { useAppContext } from './useCityAppContext'

const useResourceCache = (): LanguageResourceCacheStateType => {
  const { cityCode, languageCode } = useAppContext()
  const response = useLoadAsync(
    useCallback(
      async () => (cityCode ? dataContainer.getResourceCache(cityCode, languageCode) : null),
      [cityCode, languageCode],
    ),
  )
  return response.data ?? {}
}

export default useResourceCache
