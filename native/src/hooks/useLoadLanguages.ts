import { useCallback } from 'react'

import { createLanguagesEndpoint, LanguageModel, ReturnType, useLoadAsync } from 'api-client'

import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'

type UseLoadLanguagesProps = {
  cityCode: string
}

const useLoadLanguages = ({ cityCode }: UseLoadLanguagesProps): ReturnType<LanguageModel[]> => {
  const load = useCallback(async () => {
    if (await dataContainer.languagesAvailable(cityCode)) {
      return dataContainer.getLanguages(cityCode)
    }

    const payload = await createLanguagesEndpoint(await determineApiUrl()).request({ city: cityCode })
    if (payload.data) {
      await dataContainer.setLanguages(cityCode, payload.data)
    }
    return payload.data ?? null
  }, [cityCode])

  return useLoadAsync(load)
}

export default useLoadLanguages
