import { useMemo } from 'react'

import { SearchResult } from 'shared'
import { createCategoriesEndpoint, createEventsEndpoint, createPOIsEndpoint, useLoadFromEndpoint } from 'shared/api'

type useSearchParams = {
  city: string
  language: string
  cmsApiBaseUrl: string
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

  const {
    data: locations,
    loading: locationsLoading,
    error: locationsError,
  } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, params)

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
        thumbnail: event.thumbnail,
      })) ?? []),
      ...(locations?.map(location => ({
        title: location.title,
        content: location.content,
        path: location.path,
        id: location.slug,
        thumbnail: location.thumbnail,
      })) ?? []),
    ],
    [categories, events, locations],
  )

  return {
    data: allPossibleResults,
    loading: categoriesLoading || eventsLoading || locationsLoading,
    error: categoriesError || eventsError || locationsError,
  }
}

export default useAllPossibleSearchResults
