import { useCallback } from 'react'

import { useLoadAsync } from 'api-client'

import { LanguageResourceCacheStateType } from '../utils/DataContainer'
import dataContainer from '../utils/DefaultDataContainer'

type UseResourceCacheProps = {
  cityCode: string
  languageCode: string
}

const useResourceCache = ({ cityCode, languageCode }: UseResourceCacheProps): LanguageResourceCacheStateType =>
  useLoadAsync(useCallback(() => dataContainer.getResourceCache(cityCode, languageCode), [cityCode, languageCode]))
    .data ?? {}

export default useResourceCache
