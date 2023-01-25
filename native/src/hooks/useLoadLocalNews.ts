import { useCallback } from 'react'

import { createLocalNewsEndpoint, LocalNewsModel, ReturnType, useLoadAsync } from 'api-client'

import { determineApiUrl } from '../utils/helpers'

type UseLoadLocalNewsProps = {
  cityCode: string
  languageCode: string
}

const useLoadLocalNews = ({ cityCode, languageCode }: UseLoadLocalNewsProps): ReturnType<LocalNewsModel[]> => {
  const load = useCallback(async () => {
    const payload = await createLocalNewsEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    if (!payload.data) {
      throw new Error('Data missing!')
    }
    return payload.data
  }, [cityCode, languageCode])

  return useLoadAsync(load)
}

export default useLoadLocalNews
