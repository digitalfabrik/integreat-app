import { useCallback, useEffect, useState } from 'react'

import {
  createTunewsElementEndpoint,
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
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

export type TuNewsReturnType = ReturnType<TunewsModel []> & {
  loadMore: () => void
}

const useLoadTuNews = ({ city, language, newsId }: ParamsType): TuNewsReturnType => {
  const [page, setPage] = useState<number>(FIRST_PAGE_INDEX)
  const [data, setData] = useState<TunewsModel[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Appends data for list or replaces data for detail endpoint
  const updateData = useCallback((data: TunewsModel[] | TunewsModel | null) => {
    if (data === null) {
      setData(null)
      return
    }
    // TuNews details endpoint returns a single model but we expect an array
    const newData = Array.isArray(data) ? data : [data]
    setData(previousData => [...(previousData ?? []), ...newData])
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setPage(FIRST_PAGE_INDEX)
  }, [])

  const load = useCallback(() => {
    const request = async () => {
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
    loadMore
  }
}

export default useLoadTuNews
