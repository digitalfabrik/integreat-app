import { useMemo } from 'react'

import { createCategoriesEndpoint, createEventsEndpoint, useLoadFromEndpoint } from '../..'

type useSearchParams = {
  city: string
  language: string
  cmsApiBaseUrl: string
}

export type SearchResult = {
  title: string
  id: string | number
  thumbnail?: string
  content: string
  path: string
}

const useAllPossibleSearchResults = ({
  city,
  language,
  cmsApiBaseUrl,
}: useSearchParams): {
  data: SearchResult[]
  loading: boolean
  error: Error | null
} => {
  const params = { city, language }

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useLoadFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, params)

  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
  } = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, params)

  const allPossibleResults = useMemo(
    () => [
      ...(categories
        ?.toArray()
        .filter(category => !category.isRoot())
        .map(category => ({
          title: category.title,
          content: category.content,
          path: category.path,
          id: category.path,
          thumbnail: category.thumbnail,
        })) ?? []),
      ...(events?.map(event => ({
        title: event.title,
        content: event.content,
        path: event.path,
        id: event.path,
      })) ?? []),
    ],
    [categories, events],
  )

  return {
    data: allPossibleResults,
    loading: categoriesLoading || eventsLoading,
    error: categoriesError || eventsError,
  }
}

export default useAllPossibleSearchResults
