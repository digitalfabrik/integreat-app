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
    data: pois,
    loading: poisLoading,
    error: poisError,
  } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, params)

  const allPossibleResults = useMemo(
    () => [...(categories?.toArray().filter(category => !category.isRoot()) || []), ...(events || []), ...(pois || [])],
    [categories, events, pois],
  )

  return {
    data: allPossibleResults,
    loading: categoriesLoading || eventsLoading || poisLoading,
    error: categoriesError || eventsError || poisError,
  }
}

export default useAllPossibleSearchResults
