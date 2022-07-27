import { useCallback, useEffect, useState } from 'react'

import {
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  LanguageModel,
  loadFromEndpoint,
  Payload,
  ReturnType,
  TunewsModel,
} from 'api-client'

import { tunewsApiUrl } from '../constants/endpoint'

const TUNEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE_INDEX = 1

type ParamsType = {
  language: string
}

type TuNewsReturnType = ReturnType<TunewsModel[]> & {
  loadMore?: () => void
  loadingMore?: boolean
  availableLanguages: LanguageModel[] | null
}

const useLoadTuNews = ({ language }: ParamsType): TuNewsReturnType => {
  const [page, setPage] = useState<number>(FIRST_PAGE_INDEX)
  const [data, setData] = useState<TunewsModel[] | null>(null)
  const [availableLanguages, setAvailableLanguages] = useState<LanguageModel[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const updateData = useCallback((data: TunewsModel[] | null) => {
    setData(previousData => (data && previousData ? [...previousData, ...data] : data))
  }, [])

  const load = useCallback(() => {
    const request = async () => {
      const tuNewsLanguages = await createTunewsLanguagesEndpoint(tunewsApiUrl).request(undefined)
      setAvailableLanguages(tuNewsLanguages.data ?? null)

      if (!tuNewsLanguages.data?.find(languageModel => languageModel.code === language)) {
        return new Payload<TunewsModel[]>(false)
      }

      return createTunewsEndpoint(tunewsApiUrl).request({
        language,
        page,
        count: TUNEWS_FETCH_COUNT_LIMIT,
      })
    }

    loadFromEndpoint<TunewsModel[]>(request, updateData, setError, setLoading).catch(e => {
      setError(e)
    })
  }, [language, page, updateData])

  const loadMore = useCallback(() => {
    const hasMoreNews = data?.length === page * TUNEWS_FETCH_COUNT_LIMIT
    if (!loading && hasMoreNews) {
      setPage(page + 1)
    }
  }, [page, data, loading])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    if (page === FIRST_PAGE_INDEX) {
      load()
    } else {
      // This automatically triggers load
      setPage(FIRST_PAGE_INDEX)
    }
  }, [page, load])

  useEffect(() => {
    load()
  }, [load])

  return {
    data,
    error,
    loading: loading && !data,
    loadingMore: loading && page !== FIRST_PAGE_INDEX,
    refresh: reset,
    loadMore,
    availableLanguages,
  }
}

export default useLoadTuNews
