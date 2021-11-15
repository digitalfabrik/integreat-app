import { useCallback } from 'react'
import {
  createTunewsElementEndpoint,
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  ReturnType,
  TunewsModel,
  useLoadFromEndpoint
} from 'api-client'

import { tunewsApiUrl } from '../constants/endpoint'

const TUNEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE_INDEX = 1

type ParamsType = {
  city: string
  language: string
  newsId: string | null | undefined
  page: number
}

const useLoadLocalNews = ({ city, language, newsId, page = FIRST_PAGE_INDEX }: ParamsType): ReturnType<TunewsModel | TunewsModel[]> => {
  const request = useCallback(async () => {
    const tuNewsLanguages = await createTunewsLanguagesEndpoint(tunewsApiUrl).request(undefined)

    if (!tuNewsLanguages.data?.find(languageModel => languageModel.code === language)) {
      // TODO
      throw new Error('Language not available')
    }

    return newsId
      ? createTunewsElementEndpoint(tunewsApiUrl).request({ id: parseInt(newsId, 10) })
      : createTunewsEndpoint(tunewsApiUrl).request({
        city,
        language,
        page,
        count: TUNEWS_FETCH_COUNT_LIMIT
      })
  }, [language, city, page, newsId])

  return useLoadFromEndpoint<TunewsModel | TunewsModel[]>(request)
}

export default useLoadLocalNews
