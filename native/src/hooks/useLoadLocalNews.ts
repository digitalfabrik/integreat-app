import { useCallback } from 'react'

import { createLocalNewsEndpoint, LocalNewsModel, ReturnType, useLoadFromEndpoint } from 'api-client'

import { determineApiUrl } from '../utils/helpers'

type ParamsType = {
  city: string
  language: string
}

const useLoadLocalNews = ({ city, language }: ParamsType): ReturnType<LocalNewsModel[]> => {
  const request = useCallback(async () => {
    const apiUrl = await determineApiUrl()

    return createLocalNewsEndpoint(apiUrl).request({
      city,
      language,
    })
  }, [language, city])

  return useLoadFromEndpoint<LocalNewsModel[]>(request)
}

export default useLoadLocalNews
