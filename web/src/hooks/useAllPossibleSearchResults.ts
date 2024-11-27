import { useMemo } from 'react'

import {
  createCategoriesEndpoint,
  createEventsEndpoint,
  createPOIsEndpoint,
  ExtendedPageModel,
  useLoadFromEndpoint,
} from 'shared/api'
import { combinePossibleSearchResults } from 'shared/hooks/useSearch'

type UseAllPossibleSearchResultsProps = {
  city: string
  language: string
  cmsApiBaseUrl: string
}

type UseAllPossibleSearchResultsReturn = {
  data: ExtendedPageModel[]
  error: Error | null
  loading: boolean
}

const useAllPossibleSearchResults = ({
  city,
  language,
  cmsApiBaseUrl,
}: UseAllPossibleSearchResultsProps): UseAllPossibleSearchResultsReturn => {
  const params = { city, language }

  const categories = useLoadFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, params)
  const events = useLoadFromEndpoint(createEventsEndpoint, cmsApiBaseUrl, params)
  const pois = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, params)

  const allPossibleResults = useMemo(
    () => combinePossibleSearchResults(categories.data, events.data, pois.data),
    [categories.data, events.data, pois.data],
  )

  return {
    data: allPossibleResults,
    loading: categories.loading || events.loading || pois.loading,
    error: categories.error || events.error || pois.error,
  }
}

export default useAllPossibleSearchResults
