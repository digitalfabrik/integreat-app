import { useCallback, useEffect, useState } from 'react'

import {
  createTuNewsEndpoint,
  createTuNewsLanguagesEndpoint,
  LanguageModel,
  loadAsync,
  ReturnType,
  TuNewsModel,
} from 'shared/api'

import { tuNewsApiUrl } from '../constants/endpoint'

const TU_NEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE_INDEX = 1

type ParamsType = {
  language: string
}

type TuNewsReturnType = Omit<ReturnType<TuNewsModel[]>, 'setData'> & {
  loadMore?: () => void
  loadingMore?: boolean
  availableLanguages: LanguageModel[] | null
}

const useLoadTuNews = ({ language }: ParamsType): TuNewsReturnType => {
  const [page, setPage] = useState<number>(FIRST_PAGE_INDEX)
  const [data, setData] = useState<TuNewsModel[] | null>(null)
  const [availableLanguages, setAvailableLanguages] = useState<LanguageModel[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const updateData = useCallback((data: TuNewsModel[] | null) => {
    setData(previousData => (data && previousData ? [...previousData, ...data] : data))
  }, [])

  const load = useCallback(() => {
    const request = async () => {
      const tuNewsLanguages = await createTuNewsLanguagesEndpoint(tuNewsApiUrl).request(undefined)
      setAvailableLanguages(tuNewsLanguages.data ?? null)

      if (!tuNewsLanguages.data?.find(languageModel => languageModel.code === language)) {
        return []
      }

      const { data } = await createTuNewsEndpoint(tuNewsApiUrl).request({
        language,
        page,
        count: TU_NEWS_FETCH_COUNT_LIMIT,
      })

      if (!data) {
        throw new Error('Data missing!')
      }

      return data
    }

    loadAsync<TuNewsModel[]>(request, updateData, setError, setLoading).catch(e => {
      setError(e)
    })
  }, [language, page, updateData])

  const loadMore = useCallback(() => {
    const hasMoreNews = data?.length === page * TU_NEWS_FETCH_COUNT_LIMIT
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
