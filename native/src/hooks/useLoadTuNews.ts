import { useCallback, useEffect, useState } from 'react'

import {
  createTunewsElementEndpoint,
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  LanguageModel,
  loadFromEndpoint,
  ReturnType,
  TunewsModel
} from 'api-client'

import { tunewsApiUrl } from '../constants/endpoint'

const TUNEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE_INDEX = 1

type ParamsType = {
  city: string
  language: string
  newsId: string | null | undefined
}

type TuNewsReturnType = ReturnType<TunewsModel[]> & {
  loadMore: () => void
  availableLanguages: LanguageModel[] | null
}

const useLoadTuNews = ({ city, language, newsId }: ParamsType): TuNewsReturnType => {
  const [page, setPage] = useState<number>(FIRST_PAGE_INDEX)
  const [data, setData] = useState<TunewsModel[] | null>(null)
  const [availableLanguages, setAvailableLanguages] = useState<LanguageModel[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const updateData = useCallback((data: TunewsModel[] | TunewsModel | null) => {
    if (data === null) {
      setData(null)
    } else if (!Array.isArray(data)) {
      // TuNews details endpoint returns a single model but we expect an array
      setData([data])
    } else {
      setData(previousData => [...(previousData ?? []), ...data])
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setPage(FIRST_PAGE_INDEX)
  }, [])

  const load = useCallback(() => {
    const request = async () => {
      const tuNewsLanguages = await createTunewsLanguagesEndpoint(tunewsApiUrl).request(undefined)
      setAvailableLanguages(tuNewsLanguages.data ?? null)

      if (!tuNewsLanguages.data?.find(languageModel => languageModel.code === language)) {
        throw new Error('language not available!')
      }

      return newsId
        ? createTunewsElementEndpoint(tunewsApiUrl).request({ id: parseInt(newsId, 10) })
        : createTunewsEndpoint(tunewsApiUrl).request({
            city,
            language,
            page,
            count: TUNEWS_FETCH_COUNT_LIMIT
          })
    }

    loadFromEndpoint<TunewsModel[] | TunewsModel>(request, updateData, setError, setLoading).catch(e => setError(e))
  }, [language, city, page, newsId, updateData])

  const loadMore = useCallback(() => {
    // Only load more news if not already loading and we have more news (i.e. each page is full)
    if (!newsId && !loading && data?.length === page * TUNEWS_FETCH_COUNT_LIMIT) {
      setPage(page + 1)
    }
  }, [page, newsId, data, loading])

  useEffect(() => {
    load()
  }, [load])

  // Delete old data if changing city, language or from list to detail (or vice versa)
  useEffect(() => {
    reset()
  }, [city, language, newsId, reset])

  return {
    data,
    error,
    loading,
    refresh: reset,
    loadMore,
    availableLanguages
  }
}

export default useLoadTuNews
